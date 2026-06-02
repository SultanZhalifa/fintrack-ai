import { SettingsProvider } from './context/SettingsContext';
import { useSettings } from './context/settings-context';
import { I18nProvider } from './i18n/I18nProvider';
import { FinanceProvider } from './context/FinanceContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './app/AppLayout';
import OnboardingFlow from './features/onboarding/OnboardingFlow';

/** Bridges the active language from settings into the i18n provider. */
function LocalizedApp() {
  const { language, onboarded } = useSettings();
  return (
    <I18nProvider language={language}>
      <ToastProvider>
        {onboarded ? (
          <FinanceProvider>
            <AppLayout />
          </FinanceProvider>
        ) : (
          <OnboardingFlow />
        )}
      </ToastProvider>
    </I18nProvider>
  );
}

/**
 * App root — Settings is outermost (owns language + currency), then i18n,
 * toasts, and finance data.
 */
export default function App() {
  return (
    <SettingsProvider>
      <LocalizedApp />
    </SettingsProvider>
  );
}
