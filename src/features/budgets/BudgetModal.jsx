import { useState } from 'react';
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
 * Inner form — state initialized once from props, remounted via `key` on open.
 * The limit is entered/displayed in the user's currency and stored in IDR base.
 */
function BudgetForm({ editing, onClose }) {
  const { budgets, setBudget, categories } = useFinance();
  const { notify } = useToast();
  const { baseCurrency, rates } = useSettings();
  const t = useT();
  const [category, setCategory] = useState(editing || '');
  const [amount, setAmount] = useState(
    editing && budgets[editing] != null
      ? String(Math.round(convertFromBase(budgets[editing], baseCurrency, rates) * 100) / 100)
      : '',
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category) return setError(t('tx.err.category'));
    if (!amount || Number(amount) <= 0) return setError(t('tx.err.amount'));
    setBudget(category, convertToBase(parseFloat(amount), baseCurrency, rates));
    notify(editing ? t('budget.updated.toast') : t('budget.set.toast'), 'success');
    onClose();
  };

  const symbol = currencyMeta(baseCurrency).symbol;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 14 }}>
        <Field label={t('tx.category')}>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} disabled={!!editing}>
            <option value="">{t('tx.selectCategory')}</option>
            {categoriesOfType(categories, 'expense').map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </Select>
        </Field>
      </div>
      <div style={{ marginBottom: 22 }}>
        <Field label={`${t('budget.monthlyLimit')} (${symbol})`} error={error}>
          <Input type="number" min="0" step="any" inputMode="decimal" value={amount}
            onChange={(e) => setAmount(e.target.value)} placeholder="0" invalid={!!error} />
        </Field>
      </div>
      <Button type="submit" variant="primary" style={{ width: '100%' }}>
        {editing ? t('action.saveChanges') : t('budget.set')}
      </Button>
    </form>
  );
}

/**
 * BudgetModal — set/update a monthly budget for an expense category.
 * Pass `editing` (a category name) to lock the category and prefill the amount.
 */
export default function BudgetModal({ open, onClose, editing }) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} title={editing ? t('budget.edit') : t('budget.set')} maxWidth={420}>
      {open && <BudgetForm key={editing ?? 'new'} editing={editing} onClose={onClose} />}
    </Modal>
  );
}
