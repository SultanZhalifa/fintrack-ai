import { motion } from 'framer-motion';
import {
  FiTrendingUp, FiTrendingDown, FiCreditCard, FiPercent, FiArrowUpRight, FiArrowDownRight,
} from 'react-icons/fi';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import { formatPercent, formatDelta } from '../../lib/format';

function StatCard({ card, index }) {
  return (
    <motion.div
      className="card stat-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stat-top">
        <span className="stat-label">{card.label}</span>
        <span className="stat-icon" style={{ background: card.soft, color: card.color }}>{card.icon}</span>
      </div>
      <div className="stat-value">{card.value}</div>
      {card.delta != null ? (
        <div className={`stat-delta ${card.delta > 0 ? 'up' : card.delta < 0 ? 'down' : 'flat'}`}>
          {card.delta > 0 ? <FiArrowUpRight size={14} /> : card.delta < 0 ? <FiArrowDownRight size={14} /> : null}
          {formatDelta(card.delta)} <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>{card.deltaLabel}</span>
        </div>
      ) : (
        <div className="stat-delta flat">{card.sub}</div>
      )}
    </motion.div>
  );
}

export default function StatCards() {
  const { summary, savingsRate, monthlyDelta } = useFinance();
  const fmt = useFormat();
  const t = useT();
  const { income, expense, balance } = summary;

  const cards = [
    {
      label: t('stat.balance'), value: fmt.money(balance), delta: monthlyDelta, deltaLabel: t('stat.vsLastMonth'),
      icon: <FiCreditCard size={18} />, color: 'var(--accent)', soft: 'var(--accent-soft)',
    },
    {
      label: t('stat.income'), value: fmt.money(income), sub: t('stat.allTime'),
      icon: <FiTrendingUp size={18} />, color: 'var(--income)', soft: 'var(--income-soft)',
    },
    {
      label: t('stat.expenses'), value: fmt.money(expense), sub: t('stat.allTime'),
      icon: <FiTrendingDown size={18} />, color: 'var(--expense)', soft: 'var(--expense-soft)',
    },
    {
      label: t('stat.savingsRate'), value: formatPercent(savingsRate),
      sub: income > 0 ? t('stat.ofIncome') : t('stat.noIncome'),
      icon: <FiPercent size={18} />,
      color: savingsRate >= 20 ? 'var(--income)' : 'var(--warning)',
      soft: savingsRate >= 20 ? 'var(--income-soft)' : 'var(--warning-soft)',
    },
  ];

  return (
    <div className="stat-grid">
      {cards.map((c, i) => <StatCard key={c.label} card={c} index={i} />)}
    </div>
  );
}
