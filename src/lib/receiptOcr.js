/**
 * On-device receipt OCR fallback using Tesseract.js. 100% private — the image
 * never leaves the device. Tesseract is dynamically imported so it stays out of
 * the main bundle and only loads when this path is actually used.
 *
 * Accuracy is moderate; we extract what we reliably can (total, date, merchant)
 * and leave the rest for the user to fill in. We never fabricate values.
 */

/** Parse an Indonesian/!international amount string into a number. */
function parseAmount(raw) {
  let s = raw.replace(/[^\d.,]/g, '');
  if (!s) return NaN;
  // If both separators exist, the last one is the decimal sep.
  if (s.includes('.') && s.includes(',')) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (s.includes(',')) {
    // Indonesian thousands use '.', so a lone ',' is usually decimal — but on
    // receipts it's often thousands; treat 3-digit groups as thousands.
    s = /,\d{3}\b/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
  } else if (s.includes('.')) {
    s = /\.\d{3}\b/.test(s) ? s.replace(/\./g, '') : s;
  }
  return parseFloat(s);
}

/** Find the most likely grand-total amount from OCR text. */
function findTotal(text) {
  const lines = text.split('\n');
  const keyRe = /(grand\s*total|total\s*bayar|total|jumlah|tunai|bayar|amount\s*due)/i;
  const subRe = /(sub\s*total|subtotal)/i;
  let best = NaN;
  for (const line of lines) {
    if (!keyRe.test(line) || subRe.test(line)) continue;
    const nums = line.match(/[\d][\d.,]{2,}/g);
    if (!nums) continue;
    const val = parseAmount(nums[nums.length - 1]);
    if (!Number.isNaN(val) && (Number.isNaN(best) || val > best)) best = val;
  }
  // Fallback: the single largest number anywhere.
  if (Number.isNaN(best)) {
    for (const m of text.match(/[\d][\d.,]{3,}/g) || []) {
      const val = parseAmount(m);
      if (!Number.isNaN(val) && (Number.isNaN(best) || val > best)) best = val;
    }
  }
  return Number.isNaN(best) ? 0 : Math.round(best);
}

/** Find a purchase date and normalize to yyyy-MM-dd. */
function findDate(text) {
  const m = text.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (!m) return '';
  let [, d, mo, y] = m;
  d = d.padStart(2, '0'); mo = mo.padStart(2, '0');
  if (y.length === 2) y = `20${y}`;
  const dn = Number(d), mn = Number(mo);
  if (dn < 1 || dn > 31 || mn < 1 || mn > 12) return '';
  return `${y}-${mo}-${d}`;
}

/** Guess the merchant from the first meaningful line. */
function guessMerchant(text) {
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.length >= 3 && /[A-Za-z]/.test(t) && !/^\d/.test(t) && !/(struk|receipt|npwp|telp|jl\.)/i.test(t)) {
      return t.slice(0, 40);
    }
  }
  return '';
}

/**
 * Run on-device OCR and parse a receipt.
 * @param {string} imageDataUrl
 * @returns {{ merchant, total, date, category, raw }}
 */
export async function extractReceiptWithOcr(imageDataUrl) {
  const { default: Tesseract } = await import('tesseract.js');
  const { data } = await Tesseract.recognize(imageDataUrl, 'eng');
  const text = data.text || '';
  return {
    merchant: guessMerchant(text),
    total: findTotal(text),
    date: findDate(text),
    category: '', // OCR can't reliably categorize; left for the user
    raw: text,
  };
}

// Exposed for tests.
export const _internals = { parseAmount, findTotal, findDate, guessMerchant };
