/**
 * Pure financial calculations. No side effects, no storage — easy to test & reuse.
 */
import {
  subMonths, startOfMonth, endOfMonth, isWithinInterval,
  format, parseISO, isValid,
} from 'date-fns';

const toDate = (d) => {
  const parsed = typeof d === 'string' ? parseISO(d) : new Date(d);
  return isValid(parsed) ? parsed : new Date(d);
};

/** Income / expense / balance totals for a list of transactions. */
export function getSummary(txs = []) {
  let income = 0, expense = 0;
  for (const t of txs) {
    if (t.type === 'income') income += t.amount;
    else if (t.type === 'expense') expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

/** Savings rate as a percentage of income (0 when no income). */
export function getSavingsRate(txs = []) {
  const { income, expense } = getSummary(txs);
  if (income <= 0) return 0;
  return ((income - expense) / income) * 100;
}

/** Transactions whose date falls within the given calendar month offset (0 = current). */
export function txsForMonth(txs, monthsAgo = 0) {
  const d = subMonths(new Date(), monthsAgo);
  const start = startOfMonth(d);
  const end = endOfMonth(d);
  return txs.filter((t) => isWithinInterval(toDate(t.date), { start, end }));
}

/** Month-by-month income/expense series for the last `months` months. */
export function getMonthlyData(txs = [], months = 6) {
  return Array.from({ length: months }, (_, i) => {
    const d = subMonths(new Date(), months - 1 - i);
    const start = startOfMonth(d);
    const end = endOfMonth(d);
    const slice = txs.filter((t) => isWithinInterval(toDate(t.date), { start, end }));
    const { income, expense, balance } = getSummary(slice);
    return { month: format(d, 'MMM'), income, expense, net: balance };
  });
}

/** Expense totals grouped by category, sorted descending. */
export function getCategoryBreakdown(txs = []) {
  const map = {};
  for (const t of txs) {
    if (t.type !== 'expense') continue;
    map[t.category] = (map[t.category] || 0) + t.amount;
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, total]) => ({ cat, total }));
}

/** Month-over-month percentage change in net balance (current vs previous month). */
export function getMonthlyDelta(txs = []) {
  const current = getSummary(txsForMonth(txs, 0)).balance;
  const previous = getSummary(txsForMonth(txs, 1)).balance;
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** The single largest transaction (by amount). */
export function getLargestTransaction(txs = []) {
  return txs.reduce((max, t) => (!max || t.amount > max.amount ? t : max), null);
}

/**
 * Budget status for the current month.
 * @returns [{ category, budget, spent, remaining, pct, over }]
 */
export function getBudgetStatus(txs = [], budgets = {}) {
  const monthTxs = txsForMonth(txs, 0);
  const spentByCat = {};
  for (const t of monthTxs) {
    if (t.type !== 'expense') continue;
    spentByCat[t.category] = (spentByCat[t.category] || 0) + t.amount;
  }
  return Object.entries(budgets)
    .map(([category, budget]) => {
      const spent = spentByCat[category] || 0;
      const pct = budget > 0 ? (spent / budget) * 100 : 0;
      return {
        category,
        budget,
        spent,
        remaining: budget - spent,
        pct: Math.min(pct, 100),
        rawPct: pct,
        over: spent > budget,
      };
    })
    .sort((a, b) => b.rawPct - a.rawPct);
}

/** Apply search / type / category / date / sort to a transaction list. */
export function filterTransactions(txs = [], opts = {}) {
  const { query = '', type = 'all', category = 'all', from, to, sort = 'date-desc' } = opts;
  const q = query.trim().toLowerCase();

  let out = txs.filter((t) => {
    if (type !== 'all' && t.type !== type) return false;
    if (category !== 'all' && t.category !== category) return false;
    if (q && !`${t.note} ${t.category}`.toLowerCase().includes(q)) return false;
    if (from && toDate(t.date) < toDate(from)) return false;
    if (to && toDate(t.date) > toDate(to)) return false;
    return true;
  });

  const sorters = {
    'date-desc':   (a, b) => toDate(b.date) - toDate(a.date),
    'date-asc':    (a, b) => toDate(a.date) - toDate(b.date),
    'amount-desc': (a, b) => b.amount - a.amount,
    'amount-asc':  (a, b) => a.amount - b.amount,
  };
  out = [...out].sort(sorters[sort] || sorters['date-desc']);
  return out;
}
