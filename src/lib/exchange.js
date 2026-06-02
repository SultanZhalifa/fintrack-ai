/**
 * Live exchange rates from the Frankfurter API (open-source, ECB data, no key).
 * https://frankfurter.dev — returns rates as "target units per 1 IDR".
 *
 * Frankfurter has no IDR base, so we fetch with base=EUR and derive IDR->X.
 * On any failure we throw; callers keep the last-known rates already in settings.
 */
import { CURRENCIES, BASE_CURRENCY } from '../constants/config';

const API = 'https://api.frankfurter.dev/v1/latest';

/**
 * Fetch live rates expressed as "units of each supported currency per 1 IDR".
 * @returns {{ rates: Record<string, number>, date: string }}
 */
export async function fetchLiveRates() {
  const symbols = Object.keys(CURRENCIES).join(',');
  const res = await fetch(`${API}?base=EUR&symbols=${symbols}`);
  if (!res.ok) throw new Error(`Exchange API error ${res.status}`);
  const data = await res.json();
  const eurRates = data.rates || {};

  // eurRates[X] = X per 1 EUR. We want X per 1 IDR = eurRates[X] / eurRates[IDR].
  const eurToIdr = eurRates[BASE_CURRENCY];
  if (!eurToIdr) throw new Error('Base currency rate missing from response');

  const rates = {};
  for (const code of Object.keys(CURRENCIES)) {
    if (code === BASE_CURRENCY) { rates[code] = 1; continue; }
    if (typeof eurRates[code] === 'number') {
      rates[code] = eurRates[code] / eurToIdr;
    }
  }
  return { rates, date: data.date || new Date().toISOString().slice(0, 10) };
}
