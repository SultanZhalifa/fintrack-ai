import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import IconButton from '../../components/ui/IconButton';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import CategoryIcon from '../../components/ui/CategoryIcon';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';

const tone = (b) => (b.over ? 'var(--expense)' : b.rawPct > 80 ? 'var(--warning)' : 'var(--income)');

/**
 * BudgetCard — one category budget with spend progress and actions.
 */
export default function BudgetCard({ status, index, onEdit, onDelete }) {
  const fmt = useFormat();
  const t = useT();
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CategoryIcon category={status.category} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-1)' }}>{status.category}</div>
            <div className="card-subtitle">{t('budget.used', { pct: Math.round(status.rawPct) })}</div>
          </div>
        </div>
        <div className="tx-actions">
          <IconButton aria-label={t('budget.edit')} onClick={() => onEdit(status.category)}><FiEdit2 size={15} /></IconButton>
          <IconButton danger aria-label={t('action.remove')} onClick={() => onDelete(status.category)}><FiTrash2 size={15} /></IconButton>
        </div>
      </div>

      <ProgressBar value={status.pct} color={tone(status)} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.84rem' }}>
        <span className="mono-num" style={{ color: 'var(--text-2)' }}>{t('budget.spent', { amount: fmt.money(status.spent) })}</span>
        <span className="mono-num" style={{ color: 'var(--text-3)' }}>{t('budget.ofAmount', { amount: fmt.money(status.budget) })}</span>
      </div>

      <div style={{ marginTop: 12 }}>
        {status.over ? (
          <Badge tone="expense"><FiAlertTriangle size={12} /> {t('budget.over', { amount: fmt.money(Math.abs(status.remaining)) })}</Badge>
        ) : (
          <Badge tone="income">{t('budget.remaining', { amount: fmt.money(status.remaining) })}</Badge>
        )}
      </div>
    </motion.div>
  );
}
