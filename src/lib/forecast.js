/**
 * Balance forecasting. Projects the end-of-month net position from:
 *  - what has already happened this month (actual net), plus
 *  - scheduled recurring items still due before month end, plus
 *  - a run-rate estimate of remaining discretionary spending.
 * All amounts are IDR base.
 */
import {
  endOfMonth, startOfMonth, differenceInCalendarDays, isWithinInterval, parseISO, isAfter,
} from 'date-fns';
import { getSummary } from './finance';
import { dueOccurrences } from './recurring';

const toDate = (s) => (typeof s === 'string' ? parseISO(s) : new Date(s));

/**
 * @returns {{
 *   actualNet, projectedRecurring, projectedDiscretionary,
 *   projectedNet, daysLeft, dailyBurn
 * }}
 */
export function forecastMonth(transactions = [], recurrings = [], today = new Date()) {
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // Actual income/expense already recorded this month.
  const thisMonthTxs = transactions.filter((t) =>
    t.type !== 'transfer' && isWithinInterval(toDate(t.date), { start: monthStart, end: monthEnd }),
  );
  const { balance: actualNet } = getSummary(thisMonthTxs);

  // Remaining recurring occurrences between today and month end.
  let projectedRecurring = 0;
  for (const rule of recurrings) {
    const dueByMonthEnd = dueOccurrences(rule, monthEnd);
    for (const date of dueByMonthEnd) {
      if (isAfter(toDate(date), today)) {
        projectedRecurring += rule.type === 'income' ? rule.amount : -rule.amount;
      }
    }
  }

  // Discretionary run-rate: average daily non-recurring expense so far this month,
  // projected across the remaining days.
  const elapsedDays = Math.max(1, differenceInCalendarDays(today, monthStart) + 1);
  const daysLeft = Math.max(0, differenceInCalendarDays(monthEnd, today));
  const discretionaryExpense = thisMonthTxs
    .filter((t) => t.type === 'expense' && !t.recurringId)
    .reduce((s, t) => s + t.amount, 0);
  const dailyBurn = discretionaryExpense / elapsedDays;
  const projectedDiscretionary = -(dailyBurn * daysLeft);

  return {
    actualNet,
    projectedRecurring,
    projectedDiscretionary,
    projectedNet: actualNet + projectedRecurring + projectedDiscretionary,
    daysLeft,
    dailyBurn,
  };
}
