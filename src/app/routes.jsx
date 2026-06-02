import { FiGrid, FiList, FiPieChart, FiTarget, FiZap, FiSettings, FiCreditCard, FiRepeat } from 'react-icons/fi';
import DashboardPage from '../features/dashboard/DashboardPage';
import TransactionsPage from '../features/transactions/TransactionsPage';
import AnalyticsPage from '../features/analytics/AnalyticsPage';
import AccountsPage from '../features/accounts/AccountsPage';
import RecurringPage from '../features/recurring/RecurringPage';
import BudgetsPage from '../features/budgets/BudgetsPage';
import InsightsPage from '../features/insights/InsightsPage';
import SettingsPage from '../features/settings/SettingsPage';

/**
 * Central page registry — drives the sidebar, header, and content switch.
 * `labelKey`/`subKey` are i18n keys resolved by consumers via t().
 */
export const ROUTES = [
  { id: 'dashboard',    labelKey: 'nav.dashboard',    subKey: 'page.dashboard.sub',    icon: FiGrid,     Component: DashboardPage },
  { id: 'transactions', labelKey: 'nav.transactions', subKey: 'page.transactions.sub', icon: FiList,     Component: TransactionsPage },
  { id: 'analytics',    labelKey: 'nav.analytics',    subKey: 'page.analytics.sub',    icon: FiPieChart, Component: AnalyticsPage },
  { id: 'accounts',     labelKey: 'nav.accounts',     subKey: 'page.accounts.sub',     icon: FiCreditCard, Component: AccountsPage },
  { id: 'recurring',    labelKey: 'nav.recurring',    subKey: 'page.recurring.sub',    icon: FiRepeat,   Component: RecurringPage },
  { id: 'budgets',      labelKey: 'nav.budgets',      subKey: 'page.budgets.sub',      icon: FiTarget,   Component: BudgetsPage },
  { id: 'insights',     labelKey: 'nav.insights',     subKey: 'page.insights.sub',     icon: FiZap,      Component: InsightsPage },
  { id: 'settings',     labelKey: 'nav.settings',     subKey: 'page.settings.sub',     icon: FiSettings, Component: SettingsPage },
];

export const getRoute = (id) => ROUTES.find((r) => r.id === id) || ROUTES[0];
