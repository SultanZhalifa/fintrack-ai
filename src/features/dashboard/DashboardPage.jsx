import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import { getRoute } from '../../app/routes';
import StatCards from './StatCards';
import BudgetWidget from './BudgetWidget';
import NetWorthWidget from './NetWorthWidget';
import MonthlyChart from '../analytics/MonthlyChart';
import CategoryChart from '../analytics/CategoryChart';
import TransactionList from '../transactions/TransactionList';
import AddTransactionButton from '../transactions/AddTransactionButton';
import { useFinance } from '../../context/finance-context';
import { useT } from '../../i18n/i18n-context';

export default function DashboardPage() {
  const route = getRoute('dashboard');
  const { transactions, accounts } = useFinance();
  const t = useT();

  return (
    <>
      <PageHeader title={t(route.labelKey)} subtitle={t(route.subKey)} actions={<AddTransactionButton />} />

      <StatCards />

      <div className="two-col" style={{ marginBottom: 16 }}>
        <MonthlyChart delay={0.05} />
        <CategoryChart delay={0.1} />
      </div>

      {accounts.length > 0 && (
        <div className="two-col" style={{ marginBottom: 16 }}>
          <NetWorthWidget delay={0.12} />
          <BudgetWidget delay={0.14} />
        </div>
      )}

      <div className="two-col" style={{ marginBottom: 16 }}>
        {accounts.length === 0 && <BudgetWidget delay={0.12} />}
        <Card title={t('tx.recent')} subtitle={t('tx.last5')} delay={0.15}>
          <TransactionList transactions={transactions.slice(0, 5)} emptyMessage={t('tx.empty')} />
        </Card>
      </div>
    </>
  );
}
