/**
 * Gemini AI client for spending insights. Real analysis only — when no API key
 * is configured the UI prompts the user to add one; we never show fake sample
 * text. Set VITE_GEMINI_KEY in .env.local to enable.
 */
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || '';
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

export const isAIEnabled = Boolean(GEMINI_KEY);

/**
 * Build the analysis prompt from computed financials.
 * @param {Function} money formatter mapping an IDR-base amount to a display string
 */
export function buildInsightPrompt({ income, expense, balance, savingsRate, breakdown }, money, language = 'en') {
  const langLine = language === 'id'
    ? 'Respond in Indonesian (Bahasa Indonesia).'
    : 'Respond in English.';
  return `You are a personal finance advisor. Analyze this data and give 5 concise, actionable insights in plain text (no markdown, numbered 1-5). ${langLine}

Financial Summary:
- Total Income: ${money(income)}
- Total Expenses: ${money(expense)}
- Balance: ${money(balance)}
- Savings Rate: ${savingsRate.toFixed(1)}%

Expense Breakdown:
${breakdown.map((b) => `- ${b.cat}: ${money(b.total)}`).join('\n')}

Make the advice realistic, specific, and encouraging. Keep each point to 1-2 sentences.`;
}

/** Ask Gemini. Throws if no key is configured or the request fails. */
export async function askGemini(prompt) {
  if (!GEMINI_KEY) throw new Error('NO_API_KEY');
  const res = await fetch(MODEL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) throw new Error(`Gemini request failed (${res.status})`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}
