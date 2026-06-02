import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import IconButton from '../../components/ui/IconButton';
import CategoryIcon from '../../components/ui/CategoryIcon';
import { useFormat } from '../../hooks/useFormat';
import { useFinance } from '../../context/finance-context';
import { formatDay } from '../../lib/format';
import { accountName } from '../../lib/accounts';

/**
 * A single transaction row with edit + delete actions.
 */
export default function TransactionRow({ tx, onEdit, onDelete }) {
  const fmt = useFormat();
  const { accounts } = useFinance();
  const acct = tx.accountId ? accountName(accounts, tx.accountId) : null;
  return (
    <motion.div
      layout
      className="tx-row"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0 }}
      transition={{ duration: 0.2 }}
    >
      <CategoryIcon category={tx.category} />
      <div className="tx-info">
        <div className="tx-name">{tx.note || tx.category}</div>
        <div className="tx-meta">{tx.category} &middot; {formatDay(tx.date)}{acct ? ` · ${acct}` : ''}</div>
      </div>
      <div className={`tx-amount ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
        {fmt.signed(tx.amount, tx.type)}
      </div>
      <div className="tx-actions">
        <IconButton aria-label="Edit transaction" onClick={() => onEdit(tx)}>
          <FiEdit2 size={15} />
        </IconButton>
        <IconButton danger id={`delete-tx-${tx.id}`} aria-label="Delete transaction" onClick={() => onDelete(tx)}>
          <FiTrash2 size={15} />
        </IconButton>
      </div>
    </motion.div>
  );
}
