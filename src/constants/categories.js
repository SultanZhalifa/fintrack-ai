/**
 * Default categories. Each is { name, type, icon (registry key), color }.
 * On first run these seed the editable category store; users can add/edit/remove
 * their own. Transactions and budgets are keyed by category NAME (unique).
 */
import { resolveIcon, ICON_REGISTRY } from './categoryIcons';

export const DEFAULT_CATEGORIES = [
  // income
  { name: 'Salary',        type: 'income',  icon: 'briefcase', color: '#4B8B6F' },
  { name: 'Freelance',     type: 'income',  icon: 'code',      color: '#6E8C7E' },
  { name: 'Investment',    type: 'income',  icon: 'trending',  color: '#4B8B6F' },
  { name: 'Gift',          type: 'income',  icon: 'gift',      color: '#D99A4E' },
  { name: 'Other Income',  type: 'income',  icon: 'dollar',    color: '#4B8B6F' },
  // expense
  { name: 'Food',          type: 'expense', icon: 'coffee',    color: '#C2703D' },
  { name: 'Transport',     type: 'expense', icon: 'truck',     color: '#8C6A52' },
  { name: 'Housing',       type: 'expense', icon: 'home',      color: '#B5544A' },
  { name: 'Shopping',      type: 'expense', icon: 'bag',       color: '#D4A373' },
  { name: 'Health',        type: 'expense', icon: 'heart',     color: '#C8553D' },
  { name: 'Entertainment', type: 'expense', icon: 'monitor',   color: '#9C6B4F' },
  { name: 'Education',     type: 'expense', icon: 'book',      color: '#7A8B99' },
  { name: 'Utilities',     type: 'expense', icon: 'zap',       color: '#D99A4E' },
  { name: 'Other',         type: 'expense', icon: 'package',   color: '#998A7B' },
];

const FALLBACK = { name: 'Other', type: 'expense', icon: 'package', color: '#998A7B' };

/** Build a name -> category lookup from a categories list. */
export function indexByName(categories = []) {
  const map = {};
  for (const c of categories) map[c.name] = c;
  return map;
}

/** Resolve a category's metadata { Icon, color } from a categories list. */
export function categoryMetaFrom(categories, name) {
  const cat = categories.find((c) => c.name === name) || FALLBACK;
  return { Icon: resolveIcon(cat.icon), color: cat.color };
}

/** Categories of a given type. */
export const categoriesOfType = (categories, type) => categories.filter((c) => c.type === type);

export { ICON_REGISTRY };
