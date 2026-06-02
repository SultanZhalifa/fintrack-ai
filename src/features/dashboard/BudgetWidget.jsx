import { FiTarget } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import CategoryIcon from '../../components/ui/CategoryIcon';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';

const barColor = (b) => (b.over ? 'var(--expense)' : b.rawPct > 80 ? 'var(--warning)' : 'var(--income)');

/**
 * Compact budget-progress widget for the dashboard (top 3 by usage).
 */
export default function BudgetWidget({ delay = 0 }) {
  const { budgetStatus } = useFinance();
  const fmt = useFormat();
  const t = useT();
  const top = budgetStatus.slice(0, 3);

  return (
    <Card title={t('budget.progress')} subtitle={t('budget.thisMonth')} delay={delay}>
      {top.length === 0 ? (
        <EmptyState icon={<FiTarget />} title={t('budget.none')} message={t('budget.noneWidget')} />
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {top.map((b) => (
            <div key={b.category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--text-1)' }}>
                  <CategoryIcon category={b.category} bare size={16} /> {b.category}
                </span>
                <span className="mono-num" style={{ color: b.over ? 'var(--expense)' : 'var(--text-2)' }}>
                  {fmt.money(b.spent)} / {fmt.money(b.budget)}
                </span>
              </div>
              <ProgressBar value={b.pct} color={barColor(b)} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
