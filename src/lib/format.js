/**
 * Formatting helpers. Currency formatting is settings-driven (display currency
 * + live rates) and exposed via the useFormat() hook; date/percent helpers are
 * pure and can be imported directly.
 */
import { format as formatDate } from 'date-fns';
import { formatMoney, formatMoneyCompact } from './currency';

export function formatPercent(n, digits = 0) {
  return `${(Number(n) || 0).toFixed(digits)}%`;
}

export function formatDay(date, pattern = 'MMM d, yyyy') {
  try { return formatDate(new Date(date), pattern); }
  catch { return String(date); }
}

/** "+12.4%" style delta with sign. */
export function formatDelta(n) {
  const v = Number(n) || 0;
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
}

/**
 * Build currency formatters bound to a display currency + rate table.
 * `amount` arguments are always in the app's IDR base.
 */
export function makeMoneyFormatters(baseCurrency, rates) {
  const money = (amount) => formatMoney(amount, baseCurrency, rates);
  const compact = (amount) => formatMoneyCompact(amount, baseCurrency, rates);
  const signed = (amount, type) => `${type === 'income' ? '+' : '-'}${money(Math.abs(amount))}`;
  return { money, compact, signed };
}
