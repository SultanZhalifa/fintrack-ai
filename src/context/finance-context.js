import { createContext, useContext } from 'react';

/** The Finance context object + its consumer hook (kept separate for fast-refresh). */
export const FinanceContext = createContext(null);

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within a FinanceProvider');
  return ctx;
}
