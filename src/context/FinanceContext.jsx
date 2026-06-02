import { useMemo, useCallback, useEffect, useRef } from 'react';
import { FinanceContext } from './finance-context';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../constants/config';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { readStorage } from '../lib/storage';
import {
  getSummary, getSavingsRate, getMonthlyData, getCategoryBreakdown,
  getMonthlyDelta, getBudgetStatus, getLargestTransaction,
} from '../lib/finance';
import { getAccountBalances } from '../lib/accounts';
import { materializeRecurring, nextDueLabel } from '../lib/recurring';
import { forecastMonth } from '../lib/forecast';
import { getSmartBudget } from '../lib/budgeting';
import { getHealthScore } from '../lib/health';

// Start empty — real user data only. Existing data is read straight from storage.
const initial = (key, fallback) => readStorage(key, fallback);
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEYS.transactions, initial(STORAGE_KEYS.transactions, []));
  const [budgets, setBudgets] = useLocalStorage(STORAGE_KEYS.budgets, initial(STORAGE_KEYS.budgets, {}));
  const [accounts, setAccounts] = useLocalStorage(STORAGE_KEYS.accounts, initial(STORAGE_KEYS.accounts, []));
  // Categories default to the curated set; users edit/add/remove from there.
  const [categories, setCategories] = useLocalStorage(STORAGE_KEYS.categories, initial(STORAGE_KEYS.categories, DEFAULT_CATEGORIES));
  const [recurrings, setRecurrings] = useLocalStorage(STORAGE_KEYS.recurrings, initial(STORAGE_KEYS.recurrings, []));

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
  const replaceAll = useCallback((nextTxs, nextBudgets, nextAccounts, nextCategories, nextRecurrings) => {
    setTransactions(Array.isArray(nextTxs) ? nextTxs : []);
    if (nextBudgets) setBudgets(nextBudgets);
    if (nextAccounts) setAccounts(Array.isArray(nextAccounts) ? nextAccounts : []);
    if (Array.isArray(nextCategories) && nextCategories.length) setCategories(nextCategories);
    if (Array.isArray(nextRecurrings)) setRecurrings(nextRecurrings);
  }, [setTransactions, setBudgets, setAccounts, setCategories, setRecurrings]);

  const clearAll = useCallback(() => {
    setTransactions([]);
    setBudgets({});
    setAccounts([]);
    setCategories(DEFAULT_CATEGORIES);
    setRecurrings([]);
  }, [setTransactions, setBudgets, setAccounts, setCategories, setRecurrings]);

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

  // ---- Category CRUD (keyed by unique name) ----
  const addCategory = useCallback((cat) => {
    const name = cat.name?.trim();
    if (!name) return null;
    const newCat = { name, type: cat.type || 'expense', icon: cat.icon || 'package', color: cat.color || '#998A7B' };
    setCategories((prev) => (prev.some((c) => c.name === name) ? prev : [...prev, newCat]));
    return newCat;
  }, [setCategories]);

  const updateCategory = useCallback((name, patch) => {
    setCategories((prev) => prev.map((c) => (c.name === name ? { ...c, ...patch, name } : c)));
  }, [setCategories]);

  const removeCategory = useCallback((name) => {
    setCategories((prev) => prev.filter((c) => c.name !== name));
  }, [setCategories]);

  // ---- Recurring CRUD ----
  const addRecurring = useCallback((rule) => {
    const newRule = {
      id: genId(),
      type: rule.type || 'expense',
      amount: Math.abs(Number(rule.amount)) || 0,
      category: rule.category,
      note: rule.note || '',
      accountId: rule.accountId || undefined,
      frequency: rule.frequency || 'monthly',
      startDate: rule.startDate,
      lastRun: null,
      createdAt: new Date().toISOString(),
    };
    setRecurrings((prev) => [...prev, newRule]);
    return newRule;
  }, [setRecurrings]);

  const updateRecurring = useCallback((id, patch) => {
    setRecurrings((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, [setRecurrings]);

  const removeRecurring = useCallback((id) => {
    setRecurrings((prev) => prev.filter((r) => r.id !== id));
  }, [setRecurrings]);

  // Auto-post any recurring occurrences that are due (run once per app load).
  const materializedRef = useRef(false);
  useEffect(() => {
    if (materializedRef.current) return;
    materializedRef.current = true;
    const { newTransactions, updatedRules } = materializeRecurring(recurrings, new Date(), genId);
    if (newTransactions.length > 0) {
      setTransactions((prev) => [...newTransactions, ...prev]);
      setRecurrings(updatedRules);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Derived selectors (memoized) ----
  const derived = useMemo(() => {
    const { balances, netWorth } = getAccountBalances(accounts, transactions);
    const now = new Date();
    return {
      healthScore: getHealthScore(transactions, budgets, netWorth, now),
      summary: getSummary(transactions),
      savingsRate: getSavingsRate(transactions),
      monthlyData: getMonthlyData(transactions, 6),
      breakdown: getCategoryBreakdown(transactions),
      monthlyDelta: getMonthlyDelta(transactions),
      budgetStatus: getBudgetStatus(transactions, budgets),
      largest: getLargestTransaction(transactions),
      accountBalances: balances,
      netWorth,
      forecast: forecastMonth(transactions, recurrings, now),
      recurringsDetailed: recurrings.map((r) => ({ ...r, nextDue: nextDueLabel(r, now) })),
      smartBudget: getSmartBudget(transactions, budgets, now),
    };
  }, [transactions, budgets, accounts, recurrings]);

  const value = useMemo(() => ({
    transactions, budgets, accounts, categories, recurrings,
    addTransaction, updateTransaction, deleteTransaction,
    addTransfer, addAccount, updateAccount, deleteAccount,
    addCategory, updateCategory, removeCategory,
    addRecurring, updateRecurring, removeRecurring,
    replaceAll, clearAll, setBudget, removeBudget,
    ...derived,
  }), [
    transactions, budgets, accounts, categories, recurrings,
    addTransaction, updateTransaction, deleteTransaction,
    addTransfer, addAccount, updateAccount, deleteAccount,
    addCategory, updateCategory, removeCategory,
    addRecurring, updateRecurring, removeRecurring,
    replaceAll, clearAll, setBudget, removeBudget, derived,
  ]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
