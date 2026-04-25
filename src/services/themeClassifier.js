const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Cache so AI only runs once per session
let cachedClassifications = null;
let cachedCount = 0;

export async function classifyReviewsWithAI(reviews) {
  if (cachedClassifications && cachedCount === reviews.length) {
    console.log('Using cached classifications');
    return cachedClassifications;
  }

  const BATCH_SIZE = 30;
  const batches = [];
  for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
    batches.push(reviews.slice(i, i + BATCH_SIZE));
  }

  console.log(`Classifying ${reviews.length} reviews in ${batches.length} batches...`);
  const classified = [];

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    console.log(`Batch ${b + 1}/${batches.length}...`);

    const prompt = `Classify each Groww app review into exactly one theme.

THEMES:
- kyc-onboarding: KYC, account creation, login, OTP, PAN, Aadhaar, document upload, face scan, verification, account locked, demat, sign up, account deletion
- payments-sip: SIP, payment failed, UPI, net banking, auto-debit, mandate, charge, fee, brokerage, trading, stock, share, buy, sell, order, pledge, unpledge, mutual fund, F&O, options, futures, money deducted, transaction, invest, nifty, sensex, IPO, dividend, paisa, rupee, amount, wallet, extra charge, overcharged
- withdrawals: withdrawal, redeem, refund, money not received, transfer pending, amount stuck, payout, NEFT, IMPS, bank transfer
- statements-tax: statement, tax, P&L, capital gains, XIRR, portfolio report, download report, wrong calculation, 52-week, chart data, data manipulation, historical data
- app-ux-support: app crashes, slow, UI design, customer support, notifications, OR generic reviews like "good", "nice", "best", "worst", "pathetic" with no specific feature

STRICT RULES:
- mentions money/charges/fees/stocks/trading = payments-sip
- mentions withdrawal/refund = withdrawals  
- mentions account/KYC/login = kyc-onboarding
- ONLY use app-ux-support if no other theme fits

Reviews:
${batch.map(r => `${r.id}: "${(r.text || '').substring(0, 150)}"`).join('\n')}

Return ONLY a JSON array, nothing else:
[{"id": 1, "themeId": "payments-sip"}, {"id": 2, "themeId": "kyc-onboarding"}]`;

    try {
      const response = await fetch(GROQ_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: 'You are a review classifier. Return only valid JSON arrays. No markdown, no explanation.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const firstBracket = content.indexOf('[');
      const lastBracket = content.lastIndexOf(']');
      const jsonStr = content.substring(firstBracket, lastBracket + 1);
      const results = JSON.parse(jsonStr);
      classified.push(...results);

      if (b < batches.length - 1) {
        await new Promise(r => setTimeout(r, 1500));
      }
    } catch (err) {
      console.error(`Batch ${b + 1} failed:`, err.message);
      // Smart fallback based on keywords instead of always app-ux-support
      batch.forEach(r => {
        const text = (r.text || '').toLowerCase();
        let themeId = 'app-ux-support';
        if (/sip|payment|charge|fee|stock|share|trade|invest|upi|fund|order|buy|sell|pledge|paisa|rupee/.test(text)) themeId = 'payments-sip';
        else if (/withdraw|redeem|refund|transfer|pending|stuck/.test(text)) themeId = 'withdrawals';
        else if (/kyc|account|login|otp|pan|aadhaar|document|verify/.test(text)) themeId = 'kyc-onboarding';
        else if (/statement|tax|p&l|gains|xirr|report|chart/.test(text)) themeId = 'statements-tax';
        classified.push({ id: r.id, themeId });
      });
    }
  }

  cachedClassifications = classified;
  cachedCount = reviews.length;
  return classified;
}