import { useMemo } from 'react';
import { useSettings } from '../context/settings-context';
import { makeMoneyFormatters } from '../lib/format';

/**
 * Currency formatters bound to the user's display currency + live rates.
 * Returns { money, compact, signed } — all take amounts in the IDR base.
 */
export function useFormat() {
  const { baseCurrency, rates } = useSettings();
  return useMemo(() => makeMoneyFormatters(baseCurrency, rates), [baseCurrency, rates]);
}
