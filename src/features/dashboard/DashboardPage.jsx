import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import { getRoute } from '../../app/routes';
import StatCards from './StatCards';
import BudgetWidget from './BudgetWidget';
import NetWorthWidget from './NetWorthWidget';
import MonthlyChart from '../analytics/MonthlyChart';
import CategoryChart from '../analytics/CategoryChart';
import SmartBudgetCard from '../budgets/SmartBudgetCard';
import TransactionList from '../transactions/TransactionList';
import AddTransactionButton from '../transactions/AddTransactionButton';
import { useFinance } from '../../context/finance-context';
import { useT } from '../../i18n/i18n-context';

export default function DashboardPage() {
  const route = getRoute('dashboard');
  const { transactions, accounts, budgetStatus } = useFinance();
  const t = useT();

  const hasAccounts = accounts.length > 0;
  const hasBudgets = budgetStatus.length > 0;

  return (
    <>
      <PageHeader title={t(route.labelKey)} subtitle={t(route.subKey)} actions={<AddTransactionButton />} />

      <StatCards />

      <div className="two-col" style={{ marginBottom: 16 }}>
        <MonthlyChart delay={0.05} />
        <CategoryChart delay={0.1} />
      </div>

      {/* Net worth + safe-to-spend self-hide when their data is empty. */}
      {(hasAccounts || hasBudgets) && (
        <div className="two-col" style={{ marginBottom: 16 }}>
          <NetWorthWidget delay={0.12} />
          <SmartBudgetCard delay={0.14} />
        </div>
      )}

      <div className="two-col" style={{ marginBottom: 16 }}>
        <BudgetWidget delay={0.16} />
        <Card title={t('tx.recent')} subtitle={t('tx.last5')} delay={0.18}>
          <TransactionList transactions={transactions.slice(0, 5)} emptyMessage={t('tx.empty')} />
        </Card>
      </div>
    </>
  );
}
