import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Field, Input, Select } from '../../components/ui/Field';
import { ACCOUNT_TYPE_LIST } from '../../constants/accounts';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useSettings } from '../../context/settings-context';
import { useT } from '../../i18n/i18n-context';
import { convertToBase, convertFromBase, currencyMeta } from '../../lib/currency';

function AccountForm({ editing, onClose }) {
  const { addAccount, updateAccount } = useFinance();
  const { notify } = useToast();
  const { baseCurrency, rates } = useSettings();
  const t = useT();
  const [name, setName] = useState(editing?.name || '');
  const [type, setType] = useState(editing?.type || 'cash');
  const [balance, setBalance] = useState(
    editing ? String(Math.round(convertFromBase(editing.initialBalance, baseCurrency, rates) * 100) / 100) : '',
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError(t('account.name'));
    const payload = {
      name: name.trim(),
      type,
      initialBalance: convertToBase(parseFloat(balance) || 0, baseCurrency, rates),
    };
    if (editing) {
      updateAccount(editing.id, payload);
      notify(t('account.updated'), 'success');
    } else {
      addAccount(payload);
      notify(t('account.added'), 'success');
    }
    onClose();
  };

  const symbol = currencyMeta(baseCurrency).symbol;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 14 }}>
        <Field label={t('account.name')} error={error}>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('account.namePlaceholder')} maxLength={40} invalid={!!error} />
        </Field>
      </div>
      <div className="form-grid" style={{ marginBottom: 22 }}>
        <Field label={t('account.type')}>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            {ACCOUNT_TYPE_LIST.map((a) => <option key={a.id} value={a.id}>{t(a.labelKey)}</option>)}
          </Select>
        </Field>
        <Field label={`${t('account.initialBalance')} (${symbol})`}>
          <Input type="number" step="any" inputMode="decimal" value={balance}
            onChange={(e) => setBalance(e.target.value)} placeholder="0" />
        </Field>
      </div>
      <Button type="submit" variant="primary" style={{ width: '100%' }}>
        {editing ? t('action.saveChanges') : t('account.add')}
      </Button>
    </form>
  );
}

export default function AccountModal({ open, onClose, editing }) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} title={editing ? t('account.edit') : t('account.add')} maxWidth={460}>
      {open && <AccountForm key={editing?.id ?? 'new'} editing={editing} onClose={onClose} />}
    </Modal>
  );
}
