import { FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';

/**
 * Safe-to-spend hero: the YNAB-style daily allowance + monthly pace.
 * Renders nothing if no budgets are set.
 */
export default function SmartBudgetCard({ delay = 0 }) {
  const { smartBudget } = useFinance();
  const fmt = useFormat();
  const t = useT();

  if (smartBudget.statuses.length === 0) return null;

  const { safeToSpendPerDay, remaining, daysLeft, onTrack, pacePct, totalSpent, idealPaceSpent } = smartBudget;

  return (
    <Card
      title={t('smart.title')}
      subtitle={t('smart.sub', { amount: fmt.money(remaining), days: daysLeft })}
      delay={delay}
      action={
        <Badge tone={onTrack ? 'income' : 'warning'}>
          {onTrack ? <FiTrendingUp size={12} /> : <FiAlertTriangle size={12} />}
          {onTrack ? t('smart.onTrack') : t('smart.overPace')}
        </Badge>
      }
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
        <span className="mono-num" style={{ fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: '2rem', color: 'var(--accent)' }}>
          {fmt.money(safeToSpendPerDay)}
        </span>
        <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>/ {t('smart.perDay')}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: 6 }}>
        <span>{t('smart.pace')}</span>
        <span className="mono-num">{Math.round(pacePct)}%</span>
      </div>
      <ProgressBar value={Math.min(pacePct, 100)} color={onTrack ? 'var(--income)' : 'var(--warning)'} />
      <div className="card-subtitle" style={{ marginTop: 10 }}>
        {t('smart.idealVsActual', { spent: fmt.money(totalSpent), ideal: fmt.money(idealPaceSpent) })}
      </div>
    </Card>
  );
}
