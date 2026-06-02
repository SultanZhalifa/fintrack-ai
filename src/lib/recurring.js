/**
 * Recurring-rule logic. A rule describes a transaction that repeats on a
 * frequency. We materialize concrete transactions for every occurrence that is
 * due up to today, tracking the last run so we never double-post.
 *
 * Rule shape:
 *   { id, type, amount, category, note, accountId,
 *     frequency: 'daily'|'weekly'|'monthly'|'yearly',
 *     startDate: 'yyyy-MM-dd', lastRun: 'yyyy-MM-dd'|null }
 */
import {
  addDays, addWeeks, addMonths, addYears, isAfter, isEqual, parseISO, format,
} from 'date-fns';

const STEP = {
  daily: (d) => addDays(d, 1),
  weekly: (d) => addWeeks(d, 1),
  monthly: (d) => addMonths(d, 1),
  yearly: (d) => addYears(d, 1),
};

const toDate = (s) => (s ? parseISO(s) : null);
const iso = (d) => format(d, 'yyyy-MM-dd');

/** The next occurrence date strictly after `from`, given a frequency. */
export function nextOccurrence(rule, from = new Date()) {
  const step = STEP[rule.frequency] || STEP.monthly;
  let d = toDate(rule.lastRun) || toDate(rule.startDate);
  if (!d) return null;
  // Advance until strictly after `from`.
  let guard = 0;
  while (!isAfter(d, from) && guard < 1000) { d = step(d); guard += 1; }
  return d;
}

/**
 * Compute all occurrences of a rule that are due on/before `today` but after
 * its last run (or from its start date). Returns the dates as ISO strings.
 */
export function dueOccurrences(rule, today = new Date()) {
  const step = STEP[rule.frequency] || STEP.monthly;
  const start = toDate(rule.startDate);
  if (!start) return [];

  const out = [];
  // Begin at the first un-run occurrence.
  let d = rule.lastRun ? step(toDate(rule.lastRun)) : start;
  let guard = 0;
  while ((isAfter(today, d) || isEqual(today, d)) && guard < 1000) {
    out.push(iso(d));
    d = step(d);
    guard += 1;
  }
  return out;
}

/**
 * Given the recurring rules, produce the transactions to post now and the
 * updated rules (with lastRun advanced). Pure — caller persists the results.
 * @returns {{ newTransactions: object[], updatedRules: object[] }}
 */
export function materializeRecurring(rules = [], today = new Date(), makeId = () => Math.random().toString(36).slice(2)) {
  const newTransactions = [];
  const updatedRules = rules.map((rule) => {
    const due = dueOccurrences(rule, today);
    if (due.length === 0) return rule;
    for (const date of due) {
      newTransactions.push({
        id: makeId(),
        type: rule.type,
        amount: Math.abs(Number(rule.amount)) || 0,
        category: rule.category,
        note: rule.note || '',
        accountId: rule.accountId || undefined,
        date,
        createdAt: new Date().toISOString(),
        recurringId: rule.id,
      });
    }
    return { ...rule, lastRun: due[due.length - 1] };
  });
  return { newTransactions, updatedRules };
}

/** Human-friendly next-due ISO date for display. */
export function nextDueLabel(rule, today = new Date()) {
  const next = nextOccurrence(rule, today);
  return next ? iso(next) : null;
}
