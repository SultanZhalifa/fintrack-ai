/**
 * Receipt-scan orchestrator. Resizes the photo, runs the best available engine
 * (Gemini Vision when a key is set, else on-device Tesseract), and returns a
 * normalized result for the review form. Never fabricates values.
 */
import { isVisionEnabled, extractReceiptWithGemini } from './receiptGemini';
import { extractReceiptWithOcr } from './receiptOcr';

export const ENGINE = {
  gemini: 'gemini',
  ocr: 'ocr',
};

/** True when the accurate cloud engine is available. */
export const hasCloudEngine = isVisionEnabled;

/**
 * Downscale an image File to a JPEG data URL (max edge `maxSize`) to keep
 * uploads/OCR fast and within model limits.
 */
export function fileToScaledDataUrl(file, maxSize = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const scale = maxSize / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')); };
    img.src = url;
  });
}

/**
 * Scan a receipt image File and extract { merchant, total, date, category }.
 * @param {File} file
 * @param {string[]} categoryNames  user's expense category names (for Gemini)
 * @returns {{ merchant, total, date, category, engine, dataUrl }}
 */
export async function scanReceipt(file, categoryNames = []) {
  const dataUrl = await fileToScaledDataUrl(file);

  if (isVisionEnabled) {
    try {
      const r = await extractReceiptWithGemini(dataUrl, categoryNames);
      return { ...r, engine: ENGINE.gemini, dataUrl };
    } catch {
      // Cloud failed (offline, quota, bad response) — fall back to on-device OCR.
    }
  }

  const r = await extractReceiptWithOcr(dataUrl);
  return { ...r, engine: ENGINE.ocr, dataUrl };
}
