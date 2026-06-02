import { useMemo, useCallback } from 'react';
import { I18nContext } from './i18n-context';
import en from './en';
import id from './id';

const DICTS = { en, id };

/** Interpolate {placeholders} in a template with values from `vars`. */
function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/**
 * Provides `t(key, vars)` and the active `language`. Language is owned by
 * SettingsProvider and passed in, so there is a single source of truth.
 */
export function I18nProvider({ language = 'id', children }) {
  const dict = DICTS[language] || DICTS.id;

  const t = useCallback((key, vars) => {
    const template = dict[key] ?? en[key] ?? key;
    return interpolate(template, vars);
  }, [dict]);

  const value = useMemo(() => ({ t, language }), [t, language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
