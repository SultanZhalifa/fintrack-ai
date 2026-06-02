/**
 * Currency conversion + formatting. Amounts are stored internally in the app's
 * BASE currency (IDR) as plain numbers; display converts to the user's chosen
 * base currency using live/last-known rates from settings.
 */
import { CURRENCIES, BASE_CURRENCY } from '../constants/config';

export const currencyMeta = (code) => CURRENCIES[code] || CURRENCIES[BASE_CURRENCY];

/**
 * Resolve the rate (target units per 1 IDR) for a currency, preferring the
 * user/live-overridden rate in settings, then the bundled last-known default.
 */
export function getRate(code, rates = {}) {
  if (code === BASE_CURRENCY) return 1;
  if (rates && typeof rates[code] === 'number' && rates[code] > 0) return rates[code];
  return currencyMeta(code).defaultRate;
}

/** Convert an amount stored in IDR base into the target currency. */
export function convertFromBase(amountIDR, code, rates) {
  return (Number(amountIDR) || 0) * getRate(code, rates);
}

/** Convert an amount entered in the target currency back into IDR base for storage. */
export function convertToBase(amount, code, rates) {
  const rate = getRate(code, rates);
  return rate > 0 ? (Number(amount) || 0) / rate : 0;
}

/** Format a base (IDR) amount in the user's display currency. */
export function formatMoney(amountIDR, code, rates) {
  const meta = currencyMeta(code);
  const value = convertFromBase(amountIDR, code, rates);
  const num = value.toLocaleString(meta.locale, {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });
  return `${meta.symbol} ${num}`;
}

/** Compact display ("Rp 1,2 jt" style) for axes/labels in the display currency. */
export function formatMoneyCompact(amountIDR, code, rates) {
  const meta = currencyMeta(code);
  const v = convertFromBase(amountIDR, code, rates);
  const abs = Math.abs(v);
  const fmt = (n) => n.toLocaleString(meta.locale, { maximumFractionDigits: 1 });
  if (abs >= 1_000_000_000) return `${meta.symbol} ${fmt(v / 1_000_000_000)}B`;
  if (abs >= 1_000_000)     return `${meta.symbol} ${fmt(v / 1_000_000)}M`;
  if (abs >= 1_000)         return `${meta.symbol} ${fmt(v / 1_000)}K`;
  return `${meta.symbol} ${fmt(v)}`;
}
