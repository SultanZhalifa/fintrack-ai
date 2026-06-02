import { useState } from 'react';
import { format } from 'date-fns';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Field, Input, Select } from '../../components/ui/Field';
import { categoriesOfType } from '../../constants/categories';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useSettings } from '../../context/settings-context';
import { useT } from '../../i18n/i18n-context';
import { convertToBase, convertFromBase, currencyMeta } from '../../lib/currency';

/**
 * Initial form values. `amount` is shown in the user's display currency, so an
 * existing transaction (stored in IDR base) is converted up for editing.
 */
const initialForm = (editing, baseCurrency, rates) => editing
  ? {
      type: editing.type,
      amount: String(Math.round(convertFromBase(editing.amount, baseCurrency, rates) * 100) / 100),
      category: editing.category,
      note: editing.note || '',
      date: editing.date,
      accountId: editing.accountId || '',
    }
  : { type: 'expense', amount: '', category: '', note: '', date: format(new Date(), 'yyyy-MM-dd'), accountId: '' };

function TransactionForm({ editing, onClose }) {
  const { addTransaction, updateTransaction, accounts, categories } = useFinance();
  const { notify } = useToast();
  const { baseCurrency, rates } = useSettings();
  const t = useT();
  const [form, setForm] = useState(() => initialForm(editing, baseCurrency, rates));
  const [errors, setErrors] = useState({});

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setType = (type) => setForm((f) => ({ ...f, type, category: '' }));

  const validate = () => {
    const next = {};
    if (!form.amount || Number(form.amount) <= 0) next.amount = t('tx.err.amount');
    if (!form.category) next.category = t('tx.err.category');
    if (!form.date) next.date = t('tx.err.date');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      type: form.type,
      // Convert the entered display-currency amount back to the IDR base for storage.
      amount: convertToBase(parseFloat(form.amount), baseCurrency, rates),
      category: form.category,
      note: form.note.trim(),
      date: form.date,
      accountId: form.accountId || undefined,
    };
    if (editing) {
      updateTransaction(editing.id, payload);
      notify(t('tx.updated'), 'success');
    } else {
      addTransaction(payload);
      notify(t('tx.added'), 'success');
    }
    onClose();
  };

  const symbol = currencyMeta(baseCurrency).symbol;

  return (
    <>
      <div className="segment" style={{ width: '100%', marginBottom: 20 }}>
        {['expense', 'income'].map((type) => (
          <button
            key={type}
            id={`type-${type}-btn`}
            type="button"
            className={form.type === type ? `active ${type}` : ''}
            style={{ flex: 1 }}
            onClick={() => setType(type)}
          >
            {type === 'income' ? t('tx.income') : t('tx.expense')}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid" style={{ marginBottom: 14 }}>
          <Field label={`${t('tx.amount')} (${symbol})`} error={errors.amount}>
            <Input id="tx-amount" name="amount" type="number" min="0" step="any" inputMode="decimal"
              value={form.amount} onChange={update('amount')} placeholder="0" invalid={!!errors.amount} />
          </Field>
          <Field label={t('tx.date')} error={errors.date}>
            <Input id="tx-date" name="date" type="date"
              value={form.date} onChange={update('date')} invalid={!!errors.date} />
          </Field>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Field label={t('tx.category')} error={errors.category}>
            <Select id="tx-category" name="category" value={form.category} onChange={update('category')} invalid={!!errors.category}>
              <option value="">{t('tx.selectCategory')}</option>
              {categoriesOfType(categories, form.type).map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </Select>
          </Field>
        </div>

        {accounts.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <Field label={t('account.optional')}>
              <Select id="tx-account" name="accountId" value={form.accountId} onChange={update('accountId')}>
                <option value="">{t('account.noneOption')}</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </Select>
            </Field>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <Field label={t('tx.note')}>
            <Input id="tx-note" name="note" type="text" value={form.note}
              onChange={update('note')} placeholder={t('tx.notePlaceholder')} maxLength={80} />
          </Field>
        </div>

        <Button id="tx-submit-btn" type="submit" variant="primary" style={{ width: '100%' }}>
          {editing ? t('action.saveChanges') : t('tx.save')}
        </Button>
      </form>
    </>
  );
}

/**
 * TransactionModal — create or edit a transaction. Pass `editing` (a tx) to edit.
 */
export default function TransactionModal({ open, onClose, editing }) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} title={editing ? t('tx.edit') : t('tx.add')}>
      {open && <TransactionForm key={editing?.id ?? 'new'} editing={editing} onClose={onClose} />}
    </Modal>
  );
}
