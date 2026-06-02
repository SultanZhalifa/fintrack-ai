/**
 * Pure account-balance + net-worth calculations.
 * Amounts are in the IDR base. A transaction may carry an `accountId`; a
 * transfer carries `type: 'transfer'`, `accountId` (source) and `toAccountId`.
 */

/** Current balance of one account = initialBalance + inflows - outflows - transfers out + transfers in. */
export function getAccountBalance(account, transactions = []) {
  let balance = Number(account.initialBalance) || 0;
  for (const t of transactions) {
    if (t.type === 'income' && t.accountId === account.id) balance += t.amount;
    else if (t.type === 'expense' && t.accountId === account.id) balance -= t.amount;
    else if (t.type === 'transfer') {
      if (t.accountId === account.id) balance -= t.amount;       // money leaving this account
      if (t.toAccountId === account.id) balance += t.amount;     // money arriving in this account
    }
  }
  return balance;
}

/** Balances for every account, plus the combined net worth. */
export function getAccountBalances(accounts = [], transactions = []) {
  const balances = accounts.map((a) => ({ ...a, balance: getAccountBalance(a, transactions) }));
  const netWorth = balances.reduce((sum, a) => sum + a.balance, 0);
  return { balances, netWorth };
}

/** Resolve an account's display name (falls back gracefully). */
export function accountName(accounts, id) {
  return accounts.find((a) => a.id === id)?.name || '—';
}
