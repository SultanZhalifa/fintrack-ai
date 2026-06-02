/**
 * Rule-based, offline insight generator. Produces localizable insight cards from
 * the user's real data — no API, no fabricated numbers. Each card is
 * { id, tone, icon, key, vars } where `key` resolves to an i18n template and
 * `vars` may include money amounts (already formatted by the caller) or counts.
 *
 * The caller passes a `money` formatter so amounts match the display currency.
 */
import { getCategoryBreakdown, txsForMonth, getSummary, getSavingsRate } from './finance';

/**
 * @param {object} ctx { transactions, budgetStatus, money }
 * @returns insight cards (most relevant first)
 */
export function buildInsights({ transactions = [], budgetStatus = [], money = (n) => n }) {
  const cards = [];

  // 1) Category month-over-month spikes.
  const thisMonth = getCategoryBreakdown(txsForMonth(transactions, 0));
  const lastMonth = getCategoryBreakdown(txsForMonth(transactions, 1));
  const lastMap = Object.fromEntries(lastMonth.map((b) => [b.cat, b.total]));
  for (const cur of thisMonth.slice(0, 5)) {
    const prev = lastMap[cur.cat];
    if (prev && prev > 0) {
      const change = ((cur.total - prev) / prev) * 100;
      if (change >= 25) {
        cards.push({
          id: `spike-${cur.cat}`, tone: 'warning', icon: 'up',
          key: 'insight.spike', vars: { category: cur.cat, pct: Math.round(change), amount: money(cur.total) },
          weight: change,
        });
      } else if (change <= -25) {
        cards.push({
          id: `drop-${cur.cat}`, tone: 'good', icon: 'down',
          key: 'insight.drop', vars: { category: cur.cat, pct: Math.round(Math.abs(change)) },
          weight: Math.abs(change),
        });
      }
    }
  }

  // 2) Over-budget categories.
  for (const b of budgetStatus) {
    if (b.over) {
      cards.push({
        id: `over-${b.category}`, tone: 'bad', icon: 'alert',
        key: 'insight.over', vars: { category: b.category, amount: money(Math.abs(b.remaining)) },
        weight: 1000 + b.rawPct,
      });
    }
  }

  // 3) Savings-rate observation.
  const rate = getSavingsRate(transactions);
  const { income } = getSummary(transactions);
  if (income > 0) {
    if (rate >= 20) {
      cards.push({ id: 'save-good', tone: 'good', icon: 'star', key: 'insight.saveGood', vars: { pct: Math.round(rate) }, weight: 50 });
    } else if (rate < 0) {
      cards.push({ id: 'save-neg', tone: 'bad', icon: 'alert', key: 'insight.saveNeg', vars: {}, weight: 900 });
    } else if (rate < 10) {
      cards.push({ id: 'save-low', tone: 'warning', icon: 'info', key: 'insight.saveLow', vars: { pct: Math.round(rate) }, weight: 200 });
    }
  }

  // 4) Top category concentration.
  const top = thisMonth[0];
  const totalThisMonth = thisMonth.reduce((s, b) => s + b.total, 0);
  if (top && totalThisMonth > 0) {
    const share = (top.total / totalThisMonth) * 100;
    if (share >= 40) {
      cards.push({
        id: 'concentration', tone: 'info', icon: 'pie',
        key: 'insight.concentration', vars: { category: top.cat, pct: Math.round(share) }, weight: 60,
      });
    }
  }

  // Sort by weight (most important first), cap to a tidy number.
  return cards.sort((a, b) => b.weight - a.weight).slice(0, 6);
}
