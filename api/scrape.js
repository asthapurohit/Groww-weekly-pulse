import gplay from 'google-play-scraper';
import astore from 'app-store-scraper';
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  // Verify it's called by Vercel Cron
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting weekly scrape...');
    
    // Scrape Android
    const androidResult = await gplay.reviews({
      appId: 'com.nextbillion.groww',
      lang: 'en', country: 'in', sort: 2, num: 1000
    });

    // Scrape iOS
    const iosReviews = [];
    for (let p = 1; p <= 10; p++) {
      const page = await astore.reviews({
        id: '1404871703', country: 'in',
        sort: astore.sort.RECENT, page: p
      });
      if (!page.length) break;
      iosReviews.push(...page);
      await new Promise(r => setTimeout(r, 800));
    }

    // Build CSV
    const csv = ['id,rating,title,text,date,platform'];
    androidResult.data.forEach((rev, i) => {
      const text = (rev.text||'').replace(/,/g,'；').replace(/\n/g,' ').replace(/"/g,"'");
      const title = (rev.title||'Review').replace(/,/g,'；');
      const date = new Date(rev.date).toISOString().split('T')[0];
      csv.push(`${i+1},${rev.score},"${title}","${text}",${date},Android`);
    });
    iosReviews.forEach((rev, i) => {
      const text = (rev.body||'').replace(/,/g,'；').replace(/\n/g,' ').replace(/"/g,"'");
      const title = (rev.title||'Review').replace(/,/g,'；');
      const date = new Date(rev.updated).toISOString().split('T')[0];
      csv.push(`${androidResult.data.length+i+1},${rev.score},"${title}","${text}",${date},iOS`);
    });

    const total = androidResult.data.length + iosReviews.length;
    
    // Save to Vercel Blob storage
    await put('groww_real_reviews.csv', csv.join('\n'), {
      access: 'public',
      contentType: 'text/csv'
    });

    return res.status(200).json({ 
      success: true, 
      total,
      date: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
