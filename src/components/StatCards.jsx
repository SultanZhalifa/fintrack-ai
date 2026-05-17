import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPercent } from 'react-icons/fi';
import { getSummary } from '../store';

function fmt(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function StatCards({ transactions }) {
  const { income, expense, balance } = getSummary(transactions);
  const rate = income > 0 ? ((income - expense) / income * 100).toFixed(0) : 0;

  const cards = [
    {
      label: 'Total Balance',
      value: fmt(balance),
      sub: 'All time',
      icon: <FiDollarSign size={14} />,
      color: balance >= 0 ? 'var(--green)' : 'var(--red)',
      cls: balance >= 0 ? 'amount-pos' : 'amount-neg',
    },
    {
      label: 'Total Income',
      value: fmt(income),
      sub: 'All transactions',
      icon: <FiTrendingUp size={14} />,
      color: 'var(--green)',
      cls: 'amount-pos',
    },
    {
      label: 'Total Expenses',
      value: fmt(expense),
      sub: 'All transactions',
      icon: <FiTrendingDown size={14} />,
      color: 'var(--red)',
      cls: 'amount-neg',
    },
    {
      label: 'Savings Rate',
      value: `${rate}%`,
      sub: income > 0 ? 'Of total income' : 'No income yet',
      icon: <FiPercent size={14} />,
      color: rate > 20 ? 'var(--green)' : 'var(--text-2)',
      cls: rate > 20 ? 'amount-pos' : '',
    },
  ];

  return (
    <div className="stat-grid">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
        >
          <div className="stat-label">
            <span style={{ color: c.color }}>{c.icon}</span>
            {c.label}
          </div>
          <div className={`stat-value ${c.cls}`} style={{ fontSize: '1.5rem' }}>{c.value}</div>
          <div className="stat-sub">{c.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}
