import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiRepeat } from 'react-icons/fi';
import IconButton from '../../components/ui/IconButton';
import CategoryIcon from '../../components/ui/CategoryIcon';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import { formatDay } from '../../lib/format';

export default function RecurringList({ items, onEdit, onDelete }) {
  const fmt = useFormat();
  const t = useT();

  return (
    <div>
      {items.map((r) => (
        <motion.div key={r.id} className="tx-row" layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <CategoryIcon category={r.category} />
          <div className="tx-info">
            <div className="tx-name">{r.note || r.category}</div>
            <div className="tx-meta">
              {r.category} &middot; <FiRepeat size={11} style={{ verticalAlign: 'middle' }} /> {t(`recurring.freq.${r.frequency}`)}
              {r.nextDue ? ` · ${t('recurring.nextDue', { date: formatDay(r.nextDue, 'MMM d') })}` : ''}
            </div>
          </div>
          <div className={`tx-amount ${r.type === 'income' ? 'text-income' : 'text-expense'}`}>
            {fmt.signed(r.amount, r.type)}
          </div>
          <div className="tx-actions">
            <IconButton aria-label={t('recurring.edit')} onClick={() => onEdit(r)}><FiEdit2 size={15} /></IconButton>
            <IconButton danger aria-label={t('recurring.removed')} onClick={() => onDelete(r)}><FiTrash2 size={15} /></IconButton>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
