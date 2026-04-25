// Groww App Store Reviews Data

export const WEEK_LABEL = "Apr 11 – Apr 23, 2026";

export async function loadReviews() {
  // Try to load from Vercel Blob first (auto-updated)
  // Fall back to static CSV
  const urls = [
    process.env.VITE_BLOB_CSV_URL,  // auto-updated
    '/groww_real_reviews.csv'         // static fallback
  ].filter(Boolean);

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const lines = text.trim().split('\n');
        
        const allReviews = lines.slice(1).map((line, idx) => {
          const vals = [];
          let cur = '', inQ = false;
          for (let c of line) {
            if (c === '"') { inQ = !inQ; continue; }
            if (c === ',' && !inQ) { vals.push(cur); cur = ''; continue; }
            cur += c;
          }
          vals.push(cur);
          return {
            id: idx + 1,
            rating: parseInt(vals[1]) || 3,
            title: vals[2] || 'Review',
            text: vals[3] || '',
            date: vals[4] || '',
            platform: vals[5] || 'Android'
          };
        });

        const totalScraped = allReviews.length;
        const withText = allReviews.filter(r => r.text.length > 0);
        
        console.log(`Total scraped: ${totalScraped}, With text: ${withText.length}`);
        
        // Return object with both counts
        return { reviews: withText, totalScraped };
      }
    } catch (e) {
      continue;
    }
  }
  
  throw new Error('Failed to load reviews from any source');
}

export const THEMES = [
  {
    id: 'kyc-onboarding',
    label: 'KYC & Onboarding',
    color: '#FF6B6B',
    icon: '🆔',
    keywords: [
      'kyc', 'verification', 'verify', 'document', 
      'onboarding', 'upload', 'pan', 'aadhaar', 'face',
      'identity', 'register', 'signup', 'sign up',
      'otp', 'password', 'login', 'log in', 'access',
      'delete account', 'close account', 'demat',
      'open account', 'new account', 'activate'
    ]
  },
  {
    id: 'payments-sip',
    label: 'Payments & SIP',
    color: '#4ECDC4',
    icon: '💳',
    keywords: [
      'payment', 'sip', 'upi', 'netbanking', 'wallet',
      'transaction', 'invest', 'debit', 'charge', 'charged',
      'fee', 'fees', 'extra charge', 'pledge', 'unpledge',
      'order', 'buy', 'sell', 'execute', 'trade', 'trading',
      'f&o', 'futures', 'options', 'stock', 'share',
      'mutual fund', 'money', 'amount', 'basket',
      'ads', 'advertisement', 'auto-debit', 'mandate',
      'deducted', 'twice', 'double', 'overcharged',
      'brokerage', 'margin', 'fund', 'nifty', 'sensex',
      'ipo', 'dividend', 'interest', 'returns', 'profit',
      'loss', 'paisa', 'rupee', 'rs', 'inr'
    ]
  },
  {
    id: 'withdrawals',
    label: 'Withdrawals & Refunds',
    color: '#45B7D1',
    icon: '💰',
    keywords: [
      'withdrawal', 'withdraw', 'redeem', 'redemption',
      'transfer', 'processing', 'pending', 'refund',
      'not received', 'stuck', 'hold', 'blocked',
      'return', 'payout', 'credit', 'balance',
      'bank account', 'neft', 'imps', 'rtgs'
    ]
  },
  {
    id: 'statements-tax',
    label: 'Statements & Tax',
    color: '#96CEB4',
    icon: '📊',
    keywords: [
      'statement', 'tax', 'pdf', 'download', 'capital gains',
      'filing', 'report', 'portfolio', 'xirr', 'p&l',
      'profit loss', 'manipulation', 'chart', 'graph',
      'history', 'record', 'calculation', 'calculated',
      'value', 'wrong value', 'incorrect', '52 week',
      'high', 'low', 'candle', 'technical', 'analysis'
    ]
  },
  {
    id: 'app-ux-support',
    label: 'App UX & Support',
    color: '#A29BFE',
    icon: '📱',
    keywords: [
      'app', 'application', 'crash', 'slow', 'support',
      'customer', 'service', 'interface', 'ui', 'ux',
      'notification', 'freeze', 'lag', 'speed', 'update',
      'feature', 'button', 'screen', 'response', 'feedback',
      'improve', 'issue', 'problem', 'error', 'bug', 'fix',
      'work', 'working', 'not working', 'customer care',
      'helpline', 'query', 'resolve', 'chat', 'reply',
      'good', 'best', 'nice', 'excellent', 'great', 'super',
      'bad', 'worst', 'poor', 'terrible', 'awesome', 'worst',
      'easy', 'simple', 'fast', 'quick', 'smooth', 'clean',
      'platform', 'groww', 'performance', 'experience',
      'recommend', 'rating', 'review', 'user', 'interface',
      'design', 'layout', 'navigation', 'menu', 'page',
      'load', 'loading', 'open', 'close', 'install',
      'uninstall', 'version', 'latest', 'new', 'old',
      'management', 'team', 'company', 'service',
      'faltu', 'jaberdast', 'achcha', 'bahut', 'bahut accha'
    ]
  }
];

export function assignTheme(review) {
  const reviewText = `${review.title} ${review.text}`.toLowerCase();
  
  // Score each theme
  let bestTheme = null;
  let bestScore = 0;
  
  for (const theme of THEMES) {
    const score = theme.keywords.reduce((count, keyword) => {
      return count + (reviewText.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      bestTheme = theme;
    }
  }
  
  // If no keywords matched, classify by rating
  if (!bestTheme || bestScore === 0) {
    const rating = review.rating;
    if (rating >= 4) return THEMES[4]; // positive = App UX
    if (rating <= 2) return THEMES[1]; // negative = Payments (most common complaint)
    return THEMES[4]; // neutral = App UX
  }
  
  return bestTheme;
}
