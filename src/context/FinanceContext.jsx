import { useMemo, useCallback } from 'react';
import { FinanceContext } from './finance-context';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../constants/config';
import { readStorage } from '../lib/storage';
import {
  getSummary, getSavingsRate, getMonthlyData, getCategoryBreakdown,
  getMonthlyDelta, getBudgetStatus, getLargestTransaction,
} from '../lib/finance';
import { getAccountBalances } from '../lib/accounts';

// Start empty — real user data only. Existing data is read straight from storage.
const initial = (key, fallback) => readStorage(key, fallback);
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEYS.transactions, initial(STORAGE_KEYS.transactions, []));
  const [budgets, setBudgets] = useLocalStorage(STORAGE_KEYS.budgets, initial(STORAGE_KEYS.budgets, {}));
  const [accounts, setAccounts] = useLocalStorage(STORAGE_KEYS.accounts, initial(STORAGE_KEYS.accounts, []));

  // ---- Transaction CRUD ----
  const addTransaction = useCallback((tx) => {
    const newTx = {
      ...tx,
      amount: Math.abs(Number(tx.amount)) || 0,
      id: genId(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, [setTransactions]);

  const updateTransaction = useCallback((id, patch) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, amount: Math.abs(Number(patch.amount ?? t.amount)) } : t)),
    );
  }, [setTransactions]);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, [setTransactions]);

  // ---- Transfers (stored as a single 'transfer' transaction) ----
  const addTransfer = useCallback(({ fromAccountId, toAccountId, amount, note, date }) => {
    const tx = {
      id: genId(),
      type: 'transfer',
      amount: Math.abs(Number(amount)) || 0,
      accountId: fromAccountId,
      toAccountId,
      note: note || '',
      date,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);
    return tx;
  }, [setTransactions]);

  // ---- Account CRUD ----
  const addAccount = useCallback((acc) => {
    const newAcc = {
      id: genId(),
      name: acc.name?.trim() || 'Account',
      type: acc.type || 'cash',
      initialBalance: Number(acc.initialBalance) || 0,
      createdAt: new Date().toISOString(),
    };
    setAccounts((prev) => [...prev, newAcc]);
    return newAcc;
  }, [setAccounts]);

  const updateAccount = useCallback((id, patch) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, [setAccounts]);

  const deleteAccount = useCallback((id) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    // Detach any transactions tied to the removed account (keep the records).
    setTransactions((prev) => prev.map((t) => {
      if (t.accountId === id) return { ...t, accountId: undefined };
      if (t.toAccountId === id) return { ...t, toAccountId: undefined };
      return t;
    }));
  }, [setAccounts, setTransactions]);

  // ---- Bulk data ops ----
  const replaceAll = useCallback((nextTxs, nextBudgets, nextAccounts) => {
    setTransactions(Array.isArray(nextTxs) ? nextTxs : []);
    if (nextBudgets) setBudgets(nextBudgets);
    if (nextAccounts) setAccounts(Array.isArray(nextAccounts) ? nextAccounts : []);
  }, [setTransactions, setBudgets, setAccounts]);

  const clearAll = useCallback(() => {
    setTransactions([]);
    setBudgets({});
    setAccounts([]);
  }, [setTransactions, setBudgets, setAccounts]);

  // ---- Budget CRUD ----
  const setBudget = useCallback((category, amount) => {
    setBudgets((prev) => ({ ...prev, [category]: Math.abs(Number(amount)) || 0 }));
  }, [setBudgets]);

  const removeBudget = useCallback((category) => {
    setBudgets((prev) => {
      const next = { ...prev };
      delete next[category];
      return next;
    });
  }, [setBudgets]);

  // ---- Derived selectors (memoized) ----
  const derived = useMemo(() => {
    const { balances, netWorth } = getAccountBalances(accounts, transactions);
    return {
      summary: getSummary(transactions),
      savingsRate: getSavingsRate(transactions),
      monthlyData: getMonthlyData(transactions, 6),
      breakdown: getCategoryBreakdown(transactions),
      monthlyDelta: getMonthlyDelta(transactions),
      budgetStatus: getBudgetStatus(transactions, budgets),
      largest: getLargestTransaction(transactions),
      accountBalances: balances,
      netWorth,
    };
  }, [transactions, budgets, accounts]);

  const value = useMemo(() => ({
    transactions, budgets, accounts,
    addTransaction, updateTransaction, deleteTransaction,
    addTransfer, addAccount, updateAccount, deleteAccount,
    replaceAll, clearAll, setBudget, removeBudget,
    ...derived,
  }), [
    transactions, budgets, accounts,
    addTransaction, updateTransaction, deleteTransaction,
    addTransfer, addAccount, updateAccount, deleteAccount,
    replaceAll, clearAll, setBudget, removeBudget, derived,
  ]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
