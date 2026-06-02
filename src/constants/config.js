/**
 * App-wide configuration & storage keys.
 */
export const STORAGE_KEYS = {
  transactions: 'fintrack_transactions',
  budgets:      'fintrack_budgets',
  meta:         'fintrack_meta',        // { schemaVersion, settings }
  accounts:     'fintrack_accounts',
  categories:   'fintrack_categories',
  recurrings:   'fintrack_recurrings',
};

/** Current localStorage schema version. Bump when the data shape changes. */
export const SCHEMA_VERSION = 2;

export const APP = {
  name:     'FinTrack',
  brandDot: '.ai',
};

/**
 * Supported currencies. `rate` is units per 1 unit of base (IDR) and is the
 * default; users can override rates in Settings. Rounding hints control display.
 */
export const CURRENCIES = {
  IDR: { code: 'IDR', symbol: 'Rp',  locale: 'id-ID', decimals: 0, defaultRate: 1 },
  USD: { code: 'USD', symbol: '$',   locale: 'en-US', decimals: 2, defaultRate: 0.0000615 },
  EUR: { code: 'EUR', symbol: '€',   locale: 'de-DE', decimals: 2, defaultRate: 0.0000571 },
  SGD: { code: 'SGD', symbol: 'S$',  locale: 'en-SG', decimals: 2, defaultRate: 0.0000832 },
  JPY: { code: 'JPY', symbol: '¥',   locale: 'ja-JP', decimals: 0, defaultRate: 0.00955 },
  MYR: { code: 'MYR', symbol: 'RM',  locale: 'ms-MY', decimals: 2, defaultRate: 0.000291 },
  GBP: { code: 'GBP', symbol: '£',   locale: 'en-GB', decimals: 2, defaultRate: 0.0000487 },
  AUD: { code: 'AUD', symbol: 'A$',  locale: 'en-AU', decimals: 2, defaultRate: 0.0000940 },
};

export const BASE_CURRENCY = 'IDR';
export const DEFAULT_LANGUAGE = 'id';

/** Default settings used on first run / when meta is missing. */
export const DEFAULT_SETTINGS = {
  baseCurrency: BASE_CURRENCY,
  language: DEFAULT_LANGUAGE,
  rates: {},            // user overrides: { USD: 0.000062, ... }; falls back to defaultRate
  onboarded: false,
};

/** Categorical colors for charts (mirrors CSS chart tokens). */
export const CHART_COLORS = [
  '#C2703D', '#4B8B6F', '#D99A4E', '#8C6A52', '#B5544A',
  '#6E8C7E', '#D4A373', '#9C6B4F', '#7A8B99',
];

export const INCOME_COLOR  = '#4B8B6F';
export const EXPENSE_COLOR = '#C8553D';
