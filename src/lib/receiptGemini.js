/**
 * Receipt extraction via Gemini Vision (gemini-2.0-flash is multimodal).
 * Sends the receipt image to /api/gemini, which asks for strict JSON. Real data only — throws on
 * failure so the caller can fall back to on-device OCR or manual entry.
 *
 * Privacy: this path uploads the image to Google. The UI surfaces that clearly.
 */
import { callGemini } from './gemini';

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
 * @returns {{ merchant, total, date, category, currencyHint }}
 *          total is a plain number in the receipt's currency (assumed app base IDR),
 *          date is yyyy-MM-dd or '' if unreadable.
 */
export async function extractReceiptWithGemini(imageDataUrl, categoryNames = []) {
  const text = await callGemini({ task: 'receipt', image: stripDataUrl(imageDataUrl), categories: categoryNames });
  const parsed = parseJson(text);
  return {
    merchant: String(parsed.merchant || '').trim(),
    total: Number(parsed.total) || 0,
    date: typeof parsed.date === 'string' ? parsed.date.trim() : '',
    category: String(parsed.category || '').trim(),
    currencyHint: String(parsed.currencyHint || '').trim(),
  };
}
