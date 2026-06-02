import { useMemo } from 'react';
import {
  FiArrowUpRight, FiArrowDownRight, FiAlertTriangle, FiStar, FiInfo, FiPieChart, FiZap,
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import { buildInsights } from '../../lib/insights';

const ICONS = {
  up: FiArrowUpRight, down: FiArrowDownRight, alert: FiAlertTriangle,
  star: FiStar, info: FiInfo, pie: FiPieChart,
};
const TONE = {
  good: { color: 'var(--income)', bg: 'var(--income-soft)' },
  warning: { color: 'var(--warning)', bg: 'var(--warning-soft)' },
  bad: { color: 'var(--expense)', bg: 'var(--expense-soft)' },
  info: { color: 'var(--info)', bg: 'var(--info-soft)' },
};

export default function InsightCards({ delay = 0 }) {
  const { transactions, budgetStatus } = useFinance();
  const fmt = useFormat();
  const t = useT();

  const cards = useMemo(
    () => buildInsights({ transactions, budgetStatus, money: fmt.money }),
    [transactions, budgetStatus, fmt],
  );

  return (
    <Card title={t('insight.title')} subtitle={t('insight.sub')} delay={delay}>
      {cards.length === 0 ? (
        <EmptyState icon={<FiZap />} title={t('insight.title')} message={t('insight.none')} />
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {cards.map((card) => {
            const Icon = ICONS[card.icon] || FiInfo;
            const tone = TONE[card.tone] || TONE.info;
            return (
              <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <span className="cat-icon" style={{ width: 34, height: 34, color: tone.color, background: tone.bg }}><Icon size={16} /></span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-1)', lineHeight: 1.5 }}>{t(card.key, card.vars)}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
