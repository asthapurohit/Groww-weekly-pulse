import gplay from 'google-play-scraper';
import astore from 'app-store-scraper';
import { writeFileSync } from 'fs';

console.log('Scraping Android reviews...');

const androidResult = await gplay.reviews({
  appId: 'com.nextbillion.groww',
  lang: 'en',
  country: 'in',
  sort: 2,
  num: 1000,
  paginate: false
});

const androidReviews = androidResult.data;
console.log(`Android: ${androidReviews.length} reviews`);

console.log('Scraping iOS reviews...');
const iosReviews = [];
for (let p = 1; p <= 10; p++) {
  const page = await astore.reviews({
    id: '1404871703',
    country: 'in',
    sort: astore.sort.RECENT,
    page: p
  });
  if (!page.length) break;
  iosReviews.push(...page);
  console.log(`iOS page ${p}: ${iosReviews.length} reviews`);
  await new Promise(r => setTimeout(r, 800));
}
console.log(`iOS: ${iosReviews.length} reviews`);

// Build CSV
const csv = ['id,rating,title,text,date,platform'];

androidReviews.forEach((rev, i) => {
  const text = (rev.text || '').replace(/,/g,'；').replace(/\n/g,' ').replace(/"/g,"'");
  const title = (rev.title || 'Review').replace(/,/g,'；').replace(/"/g,"'");
  const date = new Date(rev.date).toISOString().split('T')[0];
  csv.push(`${i+1},${rev.score},"${title}","${text}",${date},Android`);
});

iosReviews.forEach((rev, i) => {
  const text = (rev.body || '').replace(/,/g,'；').replace(/\n/g,' ').replace(/"/g,"'");
  const title = (rev.title || 'Review').replace(/,/g,'；').replace(/"/g,"'");
  const date = new Date(rev.updated).toISOString().split('T')[0];
  csv.push(`${androidReviews.length+i+1},${rev.score},"${title}","${text}",${date},iOS`);
});

writeFileSync('groww_real_reviews.csv', csv.join('\n'));

const total = androidReviews.length + iosReviews.length;
const allDates = [
  ...androidReviews.map(r => new Date(r.date)),
  ...iosReviews.map(r => new Date(r.updated))
].sort((a,b) => a-b);

console.log('✅ Total reviews:', total);
console.log('Oldest date:', allDates[0].toISOString().split('T')[0]);
console.log('Newest date:', allDates[allDates.length-1].toISOString().split('T')[0]);