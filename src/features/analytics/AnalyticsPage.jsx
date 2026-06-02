import { FiTrendingDown, FiAward, FiLayers } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import CategoryIcon from '../../components/ui/CategoryIcon';
import { getRoute } from '../../app/routes';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import { formatDay } from '../../lib/format';
import MonthlyChart from './MonthlyChart';
import CategoryChart from './CategoryChart';
import TrendChart from './TrendChart';

function Highlight({ icon, label, value, sub, color, soft }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span className="stat-icon" style={{ background: soft, color }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div className="stat-label" style={{ marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-d)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>{value}</div>
        {sub && <div className="card-subtitle">{sub}</div>}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const route = getRoute('analytics');
  const { breakdown, largest, summary } = useFinance();
  const fmt = useFormat();
  const t = useT();

  const topCategory = breakdown[0];

  return (
    <>
      <PageHeader title={t(route.labelKey)} subtitle={t(route.subKey)} />

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <Highlight
          icon={<FiLayers size={18} />} label={t('analytics.topCategory')}
          value={topCategory ? <><CategoryIcon category={topCategory.cat} bare size={18} /> {topCategory.cat}</> : '—'}
          sub={topCategory ? fmt.money(topCategory.total) : t('chart.noExpenses')}
          color="var(--accent)" soft="var(--accent-soft)"
        />
        <Highlight
          icon={<FiAward size={18} />} label={t('analytics.largest')}
          value={largest ? fmt.money(largest.amount) : '—'}
          sub={largest ? `${largest.category} · ${formatDay(largest.date, 'MMM d')}` : '—'}
          color="var(--warning)" soft="var(--warning-soft)"
        />
        <Highlight
          icon={<FiTrendingDown size={18} />} label={t('analytics.totalSpent')}
          value={fmt.money(summary.expense)} sub={t('analytics.allTimeExpenses')}
          color="var(--expense)" soft="var(--expense-soft)"
        />
      </div>

      <div style={{ height: 16 }} />
      <TrendChart delay={0.05} />
      <div style={{ height: 16 }} />
      <div className="two-col">
        <MonthlyChart delay={0.08} />
        <CategoryChart delay={0.1} />
      </div>
    </>
  );
}
