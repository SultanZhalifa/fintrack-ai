import { useState, useCallback, useMemo } from 'react';
import { SettingsContext } from './settings-context';
import { runMigrations, saveSettings } from '../lib/migrate';
import { fetchLiveRates } from '../lib/exchange';

// Resolve settings once, synchronously, before first render (also runs migration).
const initialSettings = runMigrations();

/**
 * Owns user settings: display currency, language, and exchange rates.
 * Persists every change into the versioned meta store. Rates can be refreshed
 * from the live Frankfurter API; the last successful result is kept for offline.
 */
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(initialSettings);

  const persist = useCallback((next) => {
    setSettings((prev) => {
      const merged = typeof next === 'function' ? next(prev) : { ...prev, ...next };
      saveSettings(merged);
      return merged;
    });
  }, []);

  const setLanguage = useCallback((language) => persist({ language }), [persist]);
  const setBaseCurrency = useCallback((baseCurrency) => persist({ baseCurrency }), [persist]);
  const markOnboarded = useCallback(() => persist({ onboarded: true }), [persist]);

  /** Fetch live rates; returns the date on success, throws on failure. */
  const refreshRates = useCallback(async () => {
    const { rates, date } = await fetchLiveRates();
    persist((prev) => ({ ...prev, rates, ratesUpdatedAt: date }));
    return date;
  }, [persist]);

  const value = useMemo(() => ({
    ...settings,
    setLanguage,
    setBaseCurrency,
    markOnboarded,
    refreshRates,
  }), [settings, setLanguage, setBaseCurrency, markOnboarded, refreshRates]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
