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

const FREQS = ['daily', 'weekly', 'monthly', 'yearly'];

function RecurringForm({ editing, onClose }) {
  const { addRecurring, updateRecurring, categories, accounts } = useFinance();
  const { notify } = useToast();
  const { baseCurrency, rates } = useSettings();
  const t = useT();
  const [form, setForm] = useState(() => editing ? {
    type: editing.type,
    amount: String(Math.round(convertFromBase(editing.amount, baseCurrency, rates) * 100) / 100),
    category: editing.category,
    note: editing.note || '',
    frequency: editing.frequency,
    startDate: editing.startDate,
    accountId: editing.accountId || '',
  } : {
    type: 'expense', amount: '', category: '', note: '',
    frequency: 'monthly', startDate: format(new Date(), 'yyyy-MM-dd'), accountId: '',
  });
  const [errors, setErrors] = useState({});

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setType = (type) => setForm((f) => ({ ...f, type, category: '' }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.amount || Number(form.amount) <= 0) next.amount = t('tx.err.amount');
    if (!form.category) next.category = t('tx.err.category');
    if (!form.startDate) next.startDate = t('tx.err.date');
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = {
      type: form.type,
      amount: convertToBase(parseFloat(form.amount), baseCurrency, rates),
      category: form.category,
      note: form.note.trim(),
      frequency: form.frequency,
      startDate: form.startDate,
      accountId: form.accountId || undefined,
    };
    if (editing) { updateRecurring(editing.id, payload); notify(t('recurring.updated'), 'success'); }
    else { addRecurring(payload); notify(t('recurring.added'), 'success'); }
    onClose();
  };

  const symbol = currencyMeta(baseCurrency).symbol;

  return (
    <form onSubmit={handleSubmit}>
      <div className="segment" style={{ width: '100%', marginBottom: 18 }}>
        {['expense', 'income'].map((type) => (
          <button key={type} type="button" className={form.type === type ? `active ${type}` : ''} style={{ flex: 1 }} onClick={() => setType(type)}>
            {type === 'income' ? t('tx.income') : t('tx.expense')}
          </button>
        ))}
      </div>

      <div className="form-grid" style={{ marginBottom: 14 }}>
        <Field label={`${t('tx.amount')} (${symbol})`} error={errors.amount}>
          <Input type="number" step="any" inputMode="decimal" value={form.amount} onChange={update('amount')} placeholder="0" invalid={!!errors.amount} />
        </Field>
        <Field label={t('recurring.frequency')}>
          <Select value={form.frequency} onChange={update('frequency')}>
            {FREQS.map((f) => <option key={f} value={f}>{t(`recurring.freq.${f}`)}</option>)}
          </Select>
        </Field>
      </div>

      <div className="form-grid" style={{ marginBottom: 14 }}>
        <Field label={t('tx.category')} error={errors.category}>
          <Select value={form.category} onChange={update('category')} invalid={!!errors.category}>
            <option value="">{t('tx.selectCategory')}</option>
            {categoriesOfType(categories, form.type).map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </Select>
        </Field>
        <Field label={t('recurring.startDate')} error={errors.startDate}>
          <Input type="date" value={form.startDate} onChange={update('startDate')} invalid={!!errors.startDate} />
        </Field>
      </div>

      {accounts.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <Field label={t('account.optional')}>
            <Select value={form.accountId} onChange={update('accountId')}>
              <option value="">{t('account.noneOption')}</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </Select>
          </Field>
        </div>
      )}

      <div style={{ marginBottom: 22 }}>
        <Field label={t('tx.note')}>
          <Input type="text" value={form.note} onChange={update('note')} placeholder={t('tx.notePlaceholder')} maxLength={60} />
        </Field>
      </div>

      <Button type="submit" variant="primary" style={{ width: '100%' }}>
        {editing ? t('action.saveChanges') : t('recurring.add')}
      </Button>
    </form>
  );
}

export default function RecurringModal({ open, onClose, editing }) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} title={editing ? t('recurring.edit') : t('recurring.add')} maxWidth={480}>
      {open && <RecurringForm key={editing?.id ?? 'new'} editing={editing} onClose={onClose} />}
    </Modal>
  );
}
