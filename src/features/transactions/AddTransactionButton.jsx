import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import TransactionModal from './TransactionModal';
import { useT } from '../../i18n/i18n-context';

/**
 * Header action: opens the Add Transaction modal.
 */
export default function AddTransactionButton() {
  const [open, setOpen] = useState(false);
  const t = useT();
  return (
    <>
      <Button id="add-tx-btn" variant="primary" onClick={() => setOpen(true)}>
        <FiPlus size={16} /> {t('tx.add')}
      </Button>
      <TransactionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
