const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callAI(prompt) {
  // Try Gemini first
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.3, 
          maxOutputTokens: 4000,
          responseMimeType: "application/json"
        }
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Gemini failed');
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first === -1) throw new Error('No JSON in Gemini response');
    return JSON.parse(text.substring(first, last + 1));
    
  } catch (geminiError) {
    console.log('Gemini failed, trying Groq...', geminiError.message);
    
    // Fallback to Groq
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a JSON generator. Return ONLY a valid JSON object, no markdown.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Groq failed');
    
    const content = data.choices?.[0]?.message?.content || '';
    const first = content.indexOf('{');
    const last = content.lastIndexOf('}');
    if (first === -1) throw new Error('No JSON in Groq response');
    
    return JSON.parse(content.substring(first, last + 1));
  }
}

export async function generatePulse({ topThemes, sampleReviews, totalReviews, avgRating, negativeCount, weekLabel }) {
  const prompt = `You are a senior product analyst for Groww app.
Analyze these reviews and return ONLY a JSON object, no markdown:

Top 3 themes: ${topThemes.map((t,i) => `${i+1}. ${t.name} - ${t.count} reviews, avg ${t.avgRating}/5`).join('; ')}
Total: ${totalReviews} reviews | Avg: ${avgRating}/5 | Negative: ${negativeCount}
Sample reviews: ${sampleReviews.slice(0, 8).map(r => `★${r.rating}: ${r.text?.substring(0,60)}`).join('\n')}

Return this exact JSON structure:
{
  "headline": "8-10 word punchy headline",
  "summary": "2 sentence summary with specific numbers",
  "themes": [
    {"name": "theme name", "insight": "specific insight under 20 words", "sentiment": "critical"},
    {"name": "theme name", "insight": "specific insight under 20 words", "sentiment": "warning"},
    {"name": "theme name", "insight": "specific insight under 20 words", "sentiment": "positive"}
  ],
  "quotes": [
    {"text": "real quote under 20 words", "themeId": "payments-sip", "rating": 1},
    {"text": "real quote under 20 words", "themeId": "app-ux-support", "rating": 2},
    {"text": "positive quote under 20 words", "themeId": "kyc-onboarding", "rating": 5}
  ],
  "actions": [
    {"title": "Fix title 5 words", "detail": "specific action under 20 words", "priority": "P0", "owner": "Engineering"},
    {"title": "Fix title 5 words", "detail": "specific action under 20 words", "priority": "P1", "owner": "Product"},
    {"title": "Fix title 5 words", "detail": "specific action under 20 words", "priority": "P1", "owner": "Support"}
  ]
}`;
  return callAI(prompt);
}

export async function generateEmail({ pulse, totalReviews, avgRating, negativeCount, weekLabel }) {
  const prompt = `Write a Groww product team weekly pulse email.
Return ONLY a JSON object on one line, use \\n for line breaks in body:
{"to":"product-team@groww.in","cc":"growth@groww.in","subject":"Weekly Pulse: ${weekLabel}","body":"email body"}

Use this data:
- ${totalReviews} reviews, avg ${parseFloat(avgRating).toFixed(1)}/5, ${Math.round(negativeCount/totalReviews*100)}% negative
- Headline: ${pulse.headline}
- Themes: ${pulse.themes?.map(t => `${t.name}: ${t.insight}`).join('; ')}
- Quotes: ${pulse.quotes?.map(q => q.text).join(' | ')}
- Actions: ${pulse.actions?.map(a => `[${a.priority}] ${a.title} (${a.owner})`).join('; ')}

Email format:
Hi Team,\\n\\nHere's this week's pulse for ${weekLabel} based on ${totalReviews} reviews (avg ${parseFloat(avgRating).toFixed(1)}/5, ${Math.round(negativeCount/totalReviews*100)}% negative):\\n\\n🔝 Top Themes\\n• [theme 1 name]: [insight]\\n• [theme 2 name]: [insight]\\n• [theme 3 name]: [insight]\\n\\n💬 What Users Are Saying\\n• "[quote 1]"\\n• "[quote 2]"\\n\\n🚀 Recommended Actions\\n1. [action 1 title]: [detail] ([owner])\\n2. [action 2 title]: [detail] ([owner])\\n3. [action 3 title]: [detail] ([owner])\\n\\n📌 Key Insight\\n[summary]\\n\\n🔗 Full dashboard: https://your-app.vercel.app\\nLast updated: April 2026 (Auto-generated. No PII included.)\\n\\nBest,\\nProduct Intelligence Team\\nGroww`;
  return callAI(prompt);
}
