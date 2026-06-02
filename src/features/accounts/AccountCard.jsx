import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import IconButton from '../../components/ui/IconButton';
import { accountTypeMeta } from '../../constants/accounts';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';

/**
 * AccountCard — one account with its live balance and edit/remove actions.
 */
export default function AccountCard({ account, index, onEdit, onDelete }) {
  const fmt = useFormat();
  const t = useT();
  const { Icon, color, labelKey } = accountTypeMeta(account.type);

  return (
    <motion.div
      className="card card-hover"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <span className="cat-icon" style={{ width: 44, height: 44, color, background: `${color}1a` }}>
          <Icon size={20} />
        </span>
        <div className="tx-actions">
          <IconButton aria-label={t('account.edit')} onClick={() => onEdit(account)}><FiEdit2 size={15} /></IconButton>
          <IconButton danger aria-label={t('account.removed')} onClick={() => onDelete(account)}><FiTrash2 size={15} /></IconButton>
        </div>
      </div>
      <div style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '1rem' }}>{account.name}</div>
      <div className="card-subtitle" style={{ marginBottom: 14 }}>{t(labelKey)}</div>
      <div className="stat-label" style={{ marginBottom: 2 }}>{t('account.balance')}</div>
      <div className="mono-num" style={{ fontFamily: 'var(--font-d)', fontWeight: 700, fontSize: '1.4rem', color: account.balance < 0 ? 'var(--expense)' : 'var(--text-1)' }}>
        {fmt.money(account.balance)}
      </div>
    </motion.div>
  );
}
