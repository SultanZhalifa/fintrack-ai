/**
 * Receipt extraction via Gemini Vision (gemini-2.0-flash is multimodal).
 * Sends the receipt image and asks for strict JSON. Real data only — throws on
 * failure so the caller can fall back to on-device OCR or manual entry.
 *
 * Privacy: this path uploads the image to Google. The UI surfaces that clearly.
 */
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || '';
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

export const isVisionEnabled = Boolean(GEMINI_KEY);

/** Strip a data-URL prefix to get raw base64. */
const stripDataUrl = (s) => s.replace(/^data:image\/\w+;base64,/, '');

/** Pull the first JSON object out of a model response (handles ```json fences). */
function parseJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON in response');
  return JSON.parse(body.slice(start, end + 1));
}

/**
 * @param {string} imageDataUrl  data URL (image/jpeg) of the receipt
 * @param {string[]} categoryNames  the user's expense category names to choose from
 * @param {string} mimeType
 * @returns {{ merchant, total, date, category, currencyHint }}
 *          total is a plain number in the receipt's currency (assumed app base IDR),
 *          date is yyyy-MM-dd or '' if unreadable.
 */
export async function extractReceiptWithGemini(imageDataUrl, categoryNames = [], mimeType = 'image/jpeg') {
  if (!GEMINI_KEY) throw new Error('NO_API_KEY');

  const cats = categoryNames.length ? categoryNames.join(', ') : 'Food, Shopping, Transport, Health, Utilities, Entertainment, Other';
  const prompt = `You are a receipt parser. Read this receipt image and return ONLY a JSON object, no prose, no markdown fences.

Extract:
- "merchant": the store/business name (string, "" if unknown)
- "total": the FINAL total paid as a plain number, no currency symbol or thousands separators (e.g. 152000). Prefer lines like TOTAL, JUMLAH, GRAND TOTAL, TUNAI/BAYAR. Use the grand total, not subtotal.
- "date": the purchase date in yyyy-MM-dd format ("" if not found). Indonesian receipts often use dd/mm/yyyy or dd-mm-yy.
- "category": pick the single best matching category from EXACTLY this list: [${cats}]. If unsure use "".
- "currencyHint": the currency code if visible (e.g. "IDR"), else "".

Return strictly: {"merchant":"","total":0,"date":"","category":"","currencyHint":""}`;

  const res = await fetch(MODEL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: stripDataUrl(imageDataUrl) } },
        ],
      }],
      generationConfig: { temperature: 0, responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) throw new Error(`Gemini Vision failed (${res.status})`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini Vision');

  const parsed = parseJson(text);
  return {
    merchant: String(parsed.merchant || '').trim(),
    total: Number(parsed.total) || 0,
    date: typeof parsed.date === 'string' ? parsed.date.trim() : '',
    category: String(parsed.category || '').trim(),
    currencyHint: String(parsed.currencyHint || '').trim(),
  };
}
