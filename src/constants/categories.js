/**
 * Transaction categories + their SVG icons (react-icons/fi), grouped by type.
 * No emoji anywhere — every glyph is a real vector icon.
 */
import {
  FiBriefcase, FiCode, FiTrendingUp, FiGift, FiDollarSign,
  FiCoffee, FiTruck, FiHome, FiShoppingBag, FiHeart,
  FiMonitor, FiBookOpen, FiZap, FiPackage,
} from 'react-icons/fi';

export const CATEGORIES = {
  income:  ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food', 'Transport', 'Housing', 'Shopping', 'Health', 'Entertainment', 'Education', 'Utilities', 'Other'],
};

/** Category -> { Icon, color } using the warm chart palette tones. */
export const CATEGORY_META = {
  // income
  Salary:        { Icon: FiBriefcase,   color: '#4B8B6F' },
  Freelance:     { Icon: FiCode,        color: '#6E8C7E' },
  Investment:    { Icon: FiTrendingUp,  color: '#4B8B6F' },
  Gift:          { Icon: FiGift,        color: '#D99A4E' },
  'Other Income':{ Icon: FiDollarSign,  color: '#4B8B6F' },
  // expense
  Food:          { Icon: FiCoffee,      color: '#C2703D' },
  Transport:     { Icon: FiTruck,       color: '#8C6A52' },
  Housing:       { Icon: FiHome,        color: '#B5544A' },
  Shopping:      { Icon: FiShoppingBag, color: '#D4A373' },
  Health:        { Icon: FiHeart,       color: '#C8553D' },
  Entertainment: { Icon: FiMonitor,     color: '#9C6B4F' },
  Education:     { Icon: FiBookOpen,    color: '#7A8B99' },
  Utilities:     { Icon: FiZap,         color: '#D99A4E' },
  Other:         { Icon: FiPackage,     color: '#998A7B' },
};

export const ALL_CATEGORIES = [...CATEGORIES.income, ...CATEGORIES.expense];

const FALLBACK_META = { Icon: FiPackage, color: '#998A7B' };

/** Resolve a category's icon metadata (always returns something valid). */
export const categoryMeta = (cat) => CATEGORY_META[cat] || FALLBACK_META;
