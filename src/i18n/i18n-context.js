import { createContext, useContext } from 'react';

/** I18n context + consumer hook. `t(key, vars)` returns a localized string. */
export const I18nContext = createContext(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}

/** Convenience: just the translate function. */
export function useT() {
  return useI18n().t;
}
