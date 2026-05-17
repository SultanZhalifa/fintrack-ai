import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const STORAGE_KEY = 'fintrack_transactions';

const CATEGORIES = {
  income:  ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food', 'Transport', 'Housing', 'Shopping', 'Health', 'Entertainment', 'Education', 'Utilities', 'Other'],
};

const CATEGORY_ICONS = {
  Salary: '💼', Freelance: '💻', Investment: '📈', Gift: '🎁', 'Other Income': '💰',
  Food: '🍔', Transport: '🚌', Housing: '🏠', Shopping: '🛒', Health: '❤️',
  Entertainment: '🎮', Education: '📚', Utilities: '💡', Other: '📦',
};

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function save(txs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
}

function getAll() { return load(); }

function add(tx) {
  const txs = load();
  const newTx = { ...tx, id: Date.now().toString(), createdAt: new Date().toISOString() };
  txs.unshift(newTx);
  save(txs);
  return newTx;
}

function remove(id) {
  const txs = load().filter(t => t.id !== id);
  save(txs);
}

function getSummary(txs) {
  const income  = txs.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  return { income, expense, balance: income - expense };
}

function getMonthlyData(txs, months = 6) {
  return Array.from({ length: months }, (_, i) => {
    const d     = subMonths(new Date(), months - 1 - i);
    const start = startOfMonth(d);
    const end   = endOfMonth(d);
    const slice = txs.filter(t => isWithinInterval(new Date(t.date), { start, end }));
    const { income, expense } = getSummary(slice);
    return { month: format(d, 'MMM'), income, expense };
  });
}

function getCategoryBreakdown(txs) {
  const expenses = txs.filter(t => t.type === 'expense');
  const map = {};
  expenses.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([cat, total]) => ({ cat, total }));
}

const SEED = [
  { id:'s1', type:'income',  amount:5000000, category:'Salary',    note:'Monthly salary',     date:'2026-05-01', createdAt:'2026-05-01T09:00:00Z' },
  { id:'s2', type:'expense', amount:800000,  category:'Food',       note:'Weekly groceries',   date:'2026-05-03', createdAt:'2026-05-03T12:00:00Z' },
  { id:'s3', type:'expense', amount:350000,  category:'Transport',  note:'Grab & bus',         date:'2026-05-05', createdAt:'2026-05-05T08:00:00Z' },
  { id:'s4', type:'income',  amount:1200000, category:'Freelance',  note:'Web project',        date:'2026-05-08', createdAt:'2026-05-08T14:00:00Z' },
  { id:'s5', type:'expense', amount:450000,  category:'Shopping',   note:'New headphones',     date:'2026-05-10', createdAt:'2026-05-10T16:00:00Z' },
  { id:'s6', type:'expense', amount:200000,  category:'Health',     note:'Vitamins',           date:'2026-05-12', createdAt:'2026-05-12T11:00:00Z' },
  { id:'s7', type:'expense', amount:150000,  category:'Entertainment', note:'Netflix + Spotify', date:'2026-05-14', createdAt:'2026-05-14T20:00:00Z' },
  { id:'s8', type:'income',  amount:500000,  category:'Gift',       note:'Birthday money',     date:'2026-05-15', createdAt:'2026-05-15T10:00:00Z' },
  { id:'s9', type:'expense', amount:2000000, category:'Housing',    note:'Monthly rent',       date:'2026-05-01', createdAt:'2026-05-01T10:00:00Z' },
  { id:'s10',type:'expense', amount:120000,  category:'Education',  note:'Udemy course',       date:'2026-05-17', createdAt:'2026-05-17T09:00:00Z' },
];

function ensureSeed() {
  if (load().length === 0) save(SEED);
}

export { CATEGORIES, CATEGORY_ICONS, getAll, add, remove, getSummary, getMonthlyData, getCategoryBreakdown, ensureSeed };
