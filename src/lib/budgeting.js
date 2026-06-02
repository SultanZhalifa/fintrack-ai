/**
 * Smart-budgeting calculations (YNAB-style): safe-to-spend per day, budget
 * pacing, and an overall zero-based summary. All amounts are IDR base.
 */
import { endOfMonth, startOfMonth, differenceInCalendarDays } from 'date-fns';
import { getBudgetStatus } from './finance';

/**
 * Smart budget summary for the current month.
 * @returns {{
 *   totalBudget, totalSpent, remaining,
 *   daysTotal, daysElapsed, daysLeft,
 *   safeToSpendPerDay, idealPaceSpent, pacePct, onTrack,
 *   statuses
 * }}
 */
export function getSmartBudget(transactions = [], budgets = {}, today = new Date()) {
  const statuses = getBudgetStatus(transactions, budgets);
  const totalBudget = statuses.reduce((s, b) => s + b.budget, 0);
  const totalSpent = statuses.reduce((s, b) => s + b.spent, 0);
  const remaining = totalBudget - totalSpent;

  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysTotal = differenceInCalendarDays(monthEnd, monthStart) + 1;
  const daysElapsed = differenceInCalendarDays(today, monthStart) + 1;
  const daysLeft = Math.max(0, daysTotal - daysElapsed);

  // What you can still spend per remaining day without exceeding total budget.
  const safeToSpendPerDay = daysLeft > 0 ? Math.max(0, remaining) / daysLeft : Math.max(0, remaining);

  // Ideal linear pace: how much "should" be spent by now.
  const idealPaceSpent = totalBudget * (daysElapsed / daysTotal);
  const pacePct = idealPaceSpent > 0 ? (totalSpent / idealPaceSpent) * 100 : 0;
  // On track if spending is at or below the linear pace (with a small grace).
  const onTrack = totalSpent <= idealPaceSpent * 1.05;

  return {
    totalBudget, totalSpent, remaining,
    daysTotal, daysElapsed, daysLeft,
    safeToSpendPerDay, idealPaceSpent, pacePct, onTrack,
    statuses,
  };
}

/** Per-category pace info (ahead/behind the linear ideal for the month). */
export function categoryPace(status, daysElapsed, daysTotal) {
  const idealSpent = status.budget * (daysElapsed / daysTotal);
  return {
    ...status,
    idealSpent,
    ahead: status.spent > idealSpent, // spending faster than ideal pace
  };
}
