import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiInbox } from 'react-icons/fi';
import TransactionRow from './TransactionRow';
import TransactionModal from './TransactionModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useT } from '../../i18n/i18n-context';

/**
 * Renders a transaction list with edit + confirm-delete.
 * `limit` collapses to N rows with a "show more" control.
 * `emptyMessage` customizes the empty state.
 */
export default function TransactionList({ transactions, limit, emptyMessage }) {
  const { deleteTransaction } = useFinance();
  const { notify } = useToast();
  const t = useT();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  if (transactions.length === 0) {
    return <EmptyState icon={<FiInbox />} title={t('tx.emptyHere')} message={emptyMessage} />;
  }

  const shown = expanded || !limit ? transactions : transactions.slice(0, limit);
  const hasMore = limit && transactions.length > limit && !expanded;

  const confirmDelete = () => {
    deleteTransaction(deleting.id);
    notify(t('tx.deleted'), 'info');
  };

  return (
    <div>
      <AnimatePresence initial={false}>
        {shown.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} onEdit={setEditing} onDelete={setDeleting} />
        ))}
      </AnimatePresence>

      {hasMore && (
        <Button variant="ghost" style={{ width: '100%', marginTop: 12 }} onClick={() => setExpanded(true)}>
          <FiChevronDown size={15} /> {t('action.showMore', { count: transactions.length - limit })}
        </Button>
      )}

      <TransactionModal open={!!editing} editing={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={t('tx.deleteTitle')}
        message={deleting ? t('tx.deleteConfirm', { name: deleting.note || deleting.category }) : ''}
        confirmLabel={t('action.delete')}
      />
    </div>
  );
}
