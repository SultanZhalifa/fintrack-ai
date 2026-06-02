/**
 * Financial health score (0-100) computed entirely from the user's real data.
 * Four equally-weighted pillars, each scored 0-25:
 *  - Savings rate (income kept)
 *  - Budget adherence (spending within set budgets this month)
 *  - Expense stability (low month-to-month volatility)
 *  - Emergency buffer (net worth vs. average monthly expense)
 * Returns the total plus a per-pillar breakdown so the UI can explain it.
 */
import { getSummary, getSavingsRate, getMonthlyData } from './finance';
import { getSmartBudget } from './budgeting';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/** Savings-rate pillar: 0% -> 0, >=30% -> 25 (linear). */
function savingsPillar(transactions) {
  const rate = getSavingsRate(transactions);
  return { score: clamp((rate / 30) * 25, 0, 25), rate };
}

/** Budget-adherence pillar: 25 when on/under total budget, decaying past it. */
function budgetPillar(transactions, budgets, today) {
  const smart = getSmartBudget(transactions, budgets, today);
  if (smart.totalBudget === 0) return { score: 12.5, ratio: null }; // neutral when no budgets
  const ratio = smart.totalSpent / smart.totalBudget; // 0..n for the month so far
  // Compare to ideal pace: under pace -> full marks, way over -> 0.
  const pace = smart.idealPaceSpent > 0 ? smart.totalSpent / smart.idealPaceSpent : 0;
  const score = clamp(25 - Math.max(0, pace - 1) * 25, 0, 25);
  return { score, ratio };
}

/** Stability pillar: low coefficient of variation in monthly expenses -> high. */
function stabilityPillar(transactions) {
  const months = getMonthlyData(transactions, 6).map((m) => m.expense).filter((v) => v > 0);
  if (months.length < 2) return { score: 12.5, cov: null };
  const mean = months.reduce((a, b) => a + b, 0) / months.length;
  if (mean === 0) return { score: 25, cov: 0 };
  const variance = months.reduce((a, b) => a + (b - mean) ** 2, 0) / months.length;
  const cov = Math.sqrt(variance) / mean; // 0 = perfectly stable
  // cov 0 -> 25, cov >= 0.6 -> 0
  return { score: clamp(25 - (cov / 0.6) * 25, 0, 25), cov };
}

/** Emergency-buffer pillar: net worth vs avg monthly expense (>=3 months -> 25). */
function bufferPillar(transactions, netWorth) {
  const months = getMonthlyData(transactions, 6).map((m) => m.expense).filter((v) => v > 0);
  const avgExpense = months.length ? months.reduce((a, b) => a + b, 0) / months.length : 0;
  if (avgExpense <= 0) return { score: netWorth > 0 ? 25 : 12.5, monthsCovered: null };
  const monthsCovered = netWorth / avgExpense;
  return { score: clamp((monthsCovered / 3) * 25, 0, 25), monthsCovered };
}

export function getHealthScore(transactions = [], budgets = {}, netWorth = 0, today = new Date()) {
  const savings = savingsPillar(transactions);
  const budget = budgetPillar(transactions, budgets, today);
  const stability = stabilityPillar(transactions);
  const buffer = bufferPillar(transactions, netWorth);

  const total = Math.round(savings.score + budget.score + stability.score + buffer.score);
  const grade = total >= 80 ? 'excellent' : total >= 60 ? 'good' : total >= 40 ? 'fair' : 'poor';

  // No data at all -> a neutral "needs data" state rather than a misleading number.
  const hasData = getSummary(transactions).income > 0 || getSummary(transactions).expense > 0;

  return {
    total,
    grade,
    hasData,
    pillars: [
      { key: 'savings',   score: Math.round(savings.score),   meta: savings },
      { key: 'budget',    score: Math.round(budget.score),    meta: budget },
      { key: 'stability', score: Math.round(stability.score), meta: stability },
      { key: 'buffer',    score: Math.round(buffer.score),    meta: buffer },
    ],
  };
}
