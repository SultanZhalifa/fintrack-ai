import { createContext, useContext } from 'react';

/** The Toast context object + its consumer hook (kept separate for fast-refresh). */
export const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
