/**
 * Gemini AI client for spending insights. Calls go through the /api/gemini
 * server function, which holds the API key (GEMINI_API_KEY); the key is never
 * shipped to the browser. Real analysis only — when the server has no key the
 * UI says so; we never show fake sample text.
 */
import { useEffect, useState } from 'react';

const ENDPOINT = '/api/gemini';

let statusPromise;
/** Resolves to true when the server has a Gemini key configured. Cached. */
export function getAIEnabled() {
  statusPromise ??= fetch(ENDPOINT)
    .then((r) => (r.ok ? r.json() : { enabled: false }))
    .then((j) => j.enabled === true)
    .catch(() => false);
  return statusPromise;
}

/** React hook form of getAIEnabled(); false until the status request resolves. */
export function useAIEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let live = true;
    getAIEnabled().then((v) => live && setEnabled(v));
    return () => { live = false; };
  }, []);
  return enabled;
}

/** POST a task to the server function and return the model's text. */
export async function callGemini(body) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Gemini request failed (${res.status})`);
  if (!data.text) throw new Error('Empty response from Gemini');
  return data.text;
}

/**
 * Ask for spending insights. Amounts are formatted on the client (display
 * currency); the server builds the prompt.
 * @param {Function} money formatter mapping an IDR-base amount to a display string
 */
export function askInsights({ income, expense, balance, savingsRate, breakdown }, money, language = 'en') {
  return callGemini({
    task: 'insight',
    summary: {
      income: money(income),
      expense: money(expense),
      balance: money(balance),
      savingsRate,
      breakdown: breakdown.map((b) => ({ cat: b.cat, total: money(b.total) })),
      language,
    },
  });
}
