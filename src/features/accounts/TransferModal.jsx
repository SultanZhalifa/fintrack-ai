import { useState } from 'react';
import { format } from 'date-fns';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Field, Input, Select } from '../../components/ui/Field';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useSettings } from '../../context/settings-context';
import { useT } from '../../i18n/i18n-context';
import { convertToBase, currencyMeta } from '../../lib/currency';

function TransferForm({ accounts, onClose }) {
  const { addTransfer } = useFinance();
  const { notify } = useToast();
  const { baseCurrency, rates } = useSettings();
  const t = useT();
  const [from, setFrom] = useState(accounts[0]?.id || '');
  const [to, setTo] = useState(accounts[1]?.id || '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (from === to) return setError(t('account.err.sameAccount'));
    if (!amount || Number(amount) <= 0) return setError(t('tx.err.amount'));
    addTransfer({
      fromAccountId: from,
      toAccountId: to,
      amount: convertToBase(parseFloat(amount), baseCurrency, rates),
      date,
    });
    notify(t('account.transferDone'), 'success');
    onClose();
  };

  const symbol = currencyMeta(baseCurrency).symbol;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid" style={{ marginBottom: 14 }}>
        <Field label={t('account.from')}>
          <Select value={from} onChange={(e) => setFrom(e.target.value)}>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </Field>
        <Field label={t('account.to')}>
          <Select value={to} onChange={(e) => setTo(e.target.value)}>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </Field>
      </div>
      <div className="form-grid" style={{ marginBottom: 22 }}>
        <Field label={`${t('tx.amount')} (${symbol})`} error={error}>
          <Input type="number" step="any" inputMode="decimal" value={amount}
            onChange={(e) => setAmount(e.target.value)} placeholder="0" invalid={!!error} />
        </Field>
        <Field label={t('tx.date')}>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>
      <Button type="submit" variant="primary" style={{ width: '100%' }}>{t('account.transfer')}</Button>
    </form>
  );
}

export default function TransferModal({ open, onClose, accounts }) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} title={t('account.transferTitle')} maxWidth={460}>
      {open && <TransferForm accounts={accounts} onClose={onClose} />}
    </Modal>
  );
}
