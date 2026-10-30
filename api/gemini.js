/**
 * Server-side Gemini proxy (Vercel Function). The API key lives in the
 * GEMINI_API_KEY environment variable and never reaches the browser.
 *
 * GET  /api/gemini            -> { enabled }
 * POST /api/gemini { task: 'insight', summary }            -> { text }
 * POST /api/gemini { task: 'receipt', image, categories }  -> { text }
 *
 * Prompts are built here, not in the client, so the endpoint can't be used as
 * a general-purpose Gemini relay.
 */
const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const MAX_IMAGE_CHARS = 3_000_000; // ~2.2 MB of JPEG as base64, under Vercel's 4.5 MB body limit
const RATE_LIMIT = 10; // requests per IP per minute (per warm instance)
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

const shortText = (v, max = 60) => (typeof v === 'string' && v.length <= max ? v : null);

function insightPrompt(summary) {
  const { income, expense, balance, savingsRate, breakdown, language } = summary || {};
  const fields = [income, expense, balance].map((v) => shortText(v));
  const rate = Number(savingsRate);
  if (fields.includes(null) || !Number.isFinite(rate) || !Array.isArray(breakdown) || breakdown.length > 50) return null;
  const lines = breakdown.map((b) => {
    const cat = shortText(b?.cat, 40);
    const total = shortText(b?.total);
    return cat && total ? `- ${cat}: ${total}` : null;
  });
  if (lines.includes(null)) return null;

  const langLine = language === 'id' ? 'Respond in Indonesian (Bahasa Indonesia).' : 'Respond in English.';
  return `You are a personal finance advisor. Analyze this data and give 5 concise, actionable insights in plain text (no markdown, numbered 1-5). ${langLine}

Financial Summary:
- Total Income: ${fields[0]}
- Total Expenses: ${fields[1]}
- Balance: ${fields[2]}
- Savings Rate: ${rate.toFixed(1)}%

Expense Breakdown:
${lines.join('\n')}

Make the advice realistic, specific, and encouraging. Keep each point to 1-2 sentences.`;
}

function receiptRequest(image, categories) {
  if (typeof image !== 'string' || image.length > MAX_IMAGE_CHARS || !/^[A-Za-z0-9+/=]+$/.test(image)) return null;
  if (!Array.isArray(categories) || categories.length > 50) return null;
  const names = categories.map((c) => shortText(c, 40));
  if (names.includes(null)) return null;

  const cats = names.length ? names.join(', ') : 'Food, Shopping, Transport, Health, Utilities, Entertainment, Other';
  const prompt = `You are a receipt parser. Read this receipt image and return ONLY a JSON object, no prose, no markdown fences.

Extract:
- "merchant": the store/business name (string, "" if unknown)
- "total": the FINAL total paid as a plain number, no currency symbol or thousands separators (e.g. 152000). Prefer lines like TOTAL, JUMLAH, GRAND TOTAL, TUNAI/BAYAR. Use the grand total, not subtotal.
- "date": the purchase date in yyyy-MM-dd format ("" if not found). Indonesian receipts often use dd/mm/yyyy or dd-mm-yy.
- "category": pick the single best matching category from EXACTLY this list: [${cats}]. If unsure use "".
- "currencyHint": the currency code if visible (e.g. "IDR"), else "".

Return strictly: {"merchant":"","total":0,"date":"","category":"","currencyHint":""}`;

  return {
    contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: 'image/jpeg', data: image } }] }],
    generationConfig: { temperature: 0, responseMimeType: 'application/json' },
  };
}

export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY;
  if (req.method === 'GET') return res.status(200).json({ enabled: Boolean(key) });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!key) return res.status(503).json({ error: 'NO_API_KEY' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  const body = req.body || {};
  let payload = null;
  if (body.task === 'insight') {
    const prompt = insightPrompt(body.summary);
    payload = prompt && { contents: [{ parts: [{ text: prompt }] }] };
  } else if (body.task === 'receipt') {
    payload = receiptRequest(body.image, body.categories);
  }
  if (!payload) return res.status(400).json({ error: 'Invalid request' });

  try {
    const upstream = await fetch(MODEL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(payload),
    });
    if (!upstream.ok) return res.status(502).json({ error: `Gemini request failed (${upstream.status})` });
    const data = await upstream.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(502).json({ error: 'Empty response from Gemini' });
    return res.status(200).json({ text });
  } catch {
    return res.status(502).json({ error: 'Gemini request failed' });
  }
}
