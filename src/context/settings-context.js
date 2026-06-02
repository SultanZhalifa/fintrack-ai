import { createContext, useContext } from 'react';

/** Settings context + consumer hook (currency, language, rates, data tools). */
export const SettingsContext = createContext(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
