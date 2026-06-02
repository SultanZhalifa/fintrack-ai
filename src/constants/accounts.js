/**
 * Account types with their SVG icons (react-icons/fi) and accent colors.
 * No emoji — every glyph is a vector icon.
 */
import { FiDollarSign, FiCreditCard, FiSmartphone, FiTrendingUp } from 'react-icons/fi';

export const ACCOUNT_TYPES = {
  cash:    { id: 'cash',    labelKey: 'account.type.cash',    Icon: FiDollarSign, color: '#4B8B6F' },
  bank:    { id: 'bank',    labelKey: 'account.type.bank',    Icon: FiCreditCard, color: '#C2703D' },
  ewallet: { id: 'ewallet', labelKey: 'account.type.ewallet', Icon: FiSmartphone, color: '#D99A4E' },
  savings: { id: 'savings', labelKey: 'account.type.savings', Icon: FiTrendingUp, color: '#6E8C7E' },
};

export const ACCOUNT_TYPE_LIST = Object.values(ACCOUNT_TYPES);

const FALLBACK = { id: 'cash', Icon: FiDollarSign, color: '#998A7B' };

export const accountTypeMeta = (type) => ACCOUNT_TYPES[type] || FALLBACK;
