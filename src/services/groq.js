// Groq API Service for AI-powered analytics

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function fetchWithRetry(body, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(GROQ_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
      },
      body: JSON.stringify(body)
    });

    if (response.status === 429) {
      const waitTime = (attempt + 1) * 15000;
      console.log(`Rate limited. Waiting ${waitTime/1000}s before retry ${attempt + 1}/${maxRetries}...`);
      await new Promise(r => setTimeout(r, waitTime));
      continue;
    }

    return response;
  }
  throw new Error('Rate limit exceeded after retries. Please wait 1 minute and try again.');
}

/**
 * Generate product pulse analysis using Groq API
 * @param {Object} params - Analysis parameters
 * @param {Array} params.topThemes - Top 3 themes with their data
 * @param {Array} params.sampleReviews - Sample low-rating reviews
 * @param {number} params.totalReviews - Total number of reviews
 * @param {number} params.avgRating - Average rating
 * @param {number} params.negativeCount - Count of negative reviews
 * @param {string} params.weekLabel - Week label for the report
 * @returns {Promise<Object>} Parsed pulse analysis object
 */
export async function generatePulse({ 
  topThemes, 
  sampleReviews, 
  totalReviews, 
  avgRating, 
  negativeCount, 
  weekLabel 
}) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  console.log("=== GROQ DEBUG ===");
  console.log("Key exists:", !!apiKey);
  console.log("Key length:", apiKey?.length);
  console.log("Key starts with:", apiKey?.substring(0, 8));
  console.log("Key type:", typeof apiKey);
  console.log("Full env object:", import.meta.env);

  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    console.log("KEY:", apiKey);
    console.log("ALL ENV:", JSON.stringify(import.meta.env));
    const systemMessage = "You are a senior product analyst. Return only valid JSON, no markdown, no explanation. For quotes: NEVER write 'no positive quotes found' — always pick actual text from the sample reviews provided. Quote text must be real words from the reviews, not placeholder text. If no 4-5 star reviews exist in samples, use the mildest 3-star review as the third quote.";
    
    const userMessage = `Analyze this app store data for ${weekLabel} and return a JSON object with the following structure:
{
  "headline": "Brief headline summarizing the week's feedback",
  "summary": "2-3 sentence summary of key insights",
  "themes": [
    {
      "name": "Theme name",
      "insight": "Specific insight about this theme",
      "sentiment": "critical|warning|positive"
    }
  ] x3,
  "quotes": [
    {"text": "specific complaint under 15 words from the sample reviews", "themeId": "payments-sip", "rating": 1},
    {"text": "another specific complaint under 15 words", "themeId": "app-ux-support", "rating": 2},
    {"text": "if no positive reviews exist, pick the least negative review text", "themeId": "app-ux-support", "rating": 3}
  ]
  "actions": [
    {
      "title": "Action title",
      "detail": "Detailed action description",
      "priority": "P0|P1|P2",
      "owner": "Team responsible"
    }
  ] x3
}

Data:
- Top themes: ${JSON.stringify(topThemes, null, 2)}
- Sample negative reviews: ${JSON.stringify(sampleReviews.slice(0, 5), null, 2)}
- Total reviews: ${totalReviews}
- Average rating: ${avgRating}
- Negative reviews: ${negativeCount}`;

    const response = await fetchWithRetry({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from Groq API');
    }

    // Strip any markdown fences before parsing
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(cleanContent);
    } catch (parseError) {
      throw new Error(`Failed to parse JSON response: ${parseError.message}. Content: ${cleanContent}`);
    }

  } catch (error) {
    throw new Error(`generatePulse failed: ${error.message}`);
  }
}

/**
 * Generate email report using Groq API
 * @param {Object} params - Email generation parameters
 * @param {Object} params.pulse - Pulse analysis data
 * @param {number} params.totalReviews - Total number of reviews
 * @param {number} params.avgRating - Average rating
 * @param {number} params.negativeCount - Count of negative reviews
 * @param {string} params.weekLabel - Week label for the report
 * @returns {Promise<Object>} Parsed email object
 */
export async function generateEmail({ 
  pulse, 
  totalReviews, 
  avgRating, 
  negativeCount, 
  weekLabel 
}) {
  console.log("API KEY:", import.meta.env.VITE_GROQ_API_KEY);
  try {
    const systemMessage = `You are a JSON generator. You must return a single-line JSON object with no newlines inside string values. Use \\n as a literal two-character sequence (backslash + n) for line breaks in the body, not actual newline characters. Return nothing except the JSON object.`;
    
    const userMessage = `Generate a professional internal 
product team email for Groww in this EXACT format.

Return only JSON on one line, use \\n for line breaks:
{"to":"product-team@groww.in","cc":"growth@groww.in","subject":"Weekly Pulse: ${weekLabel} — User Sentiment Report","body":"full email body here"}

EXACT EMAIL FORMAT TO FOLLOW:
---
Hi Team,

Here's this week's user sentiment pulse based on ${totalReviews} recent app reviews (avg rating: ${parseFloat(avgRating).toFixed(1)}, ${Math.round(negativeCount/totalReviews*100)}% negative):

🔝 Top Themes\\n
- ${pulse.themes?.[0]?.name}: ${pulse.themes?.[0]?.insight}\\n
- ${pulse.themes?.[1]?.name}: ${pulse.themes?.[1]?.insight}\\n
- ${pulse.themes?.[2]?.name}: ${pulse.themes?.[2]?.insight}\\n

💬 What Users Are Saying\\n
- "${pulse.quotes?.[0]?.text}"\\n
- "${pulse.quotes?.[1]?.text}"\\n
- "${pulse.quotes?.[2]?.text}"\\n

🚀 Recommended Actions\\n
1. ${pulse.actions?.[0]?.title}: ${pulse.actions?.[0]?.detail} (${pulse.actions?.[0]?.owner})\\n
2. ${pulse.actions?.[1]?.title}: ${pulse.actions?.[1]?.detail} (${pulse.actions?.[1]?.owner})\\n
3. ${pulse.actions?.[2]?.title}: ${pulse.actions?.[2]?.detail} (${pulse.actions?.[2]?.owner})\\n

📌 Key Insight\\n
${pulse.summary}\\n

🔗 Full dashboard: http://localhost:5173\\n
Last updated from sources: April 2026 (Auto-generated. No PII included.)\\n

Best,\\n
Product Intelligence Team\\n
Groww
---

RULES:
- Use the EXACT data provided above, do not invent new content
- Keep theme insights specific and data-driven
- Quotes must be real user quotes from the pulse data
- Actions must include owner team in brackets
- No changes to the structure or emojis
- Body under 250 words`;

    const response = await fetchWithRetry({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.4,
      max_tokens: 1000
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content from Groq');

    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error('No JSON found');

    const jsonStr = content
      .substring(firstBrace, lastBrace + 1)
      .replace(/[\r\n\t]/g, ' ')
      .replace(/\s+/g, ' ');

    return JSON.parse(jsonStr);

  } catch (error) {
    throw new Error(`generateEmail failed: ${error.message}`);
  }
}
