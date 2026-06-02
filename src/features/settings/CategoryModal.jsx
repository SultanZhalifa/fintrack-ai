import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Field, Input, Select } from '../../components/ui/Field';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useT } from '../../i18n/i18n-context';
import { createElement } from 'react';
import { ICON_KEYS, CATEGORY_COLORS, resolveIcon } from '../../constants/categoryIcons';

/** Render a registry icon by key. */
const IconGlyph = ({ iconKey, size }) => createElement(resolveIcon(iconKey), { size });

function CategoryForm({ editing, defaultType, onClose }) {
  const { categories, addCategory, updateCategory } = useFinance();
  const { notify } = useToast();
  const t = useT();
  const [name, setName] = useState(editing?.name || '');
  const [type, setType] = useState(editing?.type || defaultType || 'expense');
  const [icon, setIcon] = useState(editing?.icon || 'package');
  const [color, setColor] = useState(editing?.color || CATEGORY_COLORS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError(t('category.name'));
    if (!editing && categories.some((c) => c.name === trimmed)) return setError(t('category.exists'));
    if (editing) {
      updateCategory(editing.name, { type, icon, color });
      notify(t('category.updated'), 'success');
    } else {
      addCategory({ name: trimmed, type, icon, color });
      notify(t('category.added'), 'success');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid" style={{ marginBottom: 16 }}>
        <Field label={t('category.name')} error={error}>
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={28} disabled={!!editing} invalid={!!error} />
        </Field>
        <Field label={t('tx.category')}>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">{t('chart.expense')}</option>
            <option value="income">{t('chart.income')}</option>
          </Select>
        </Field>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className="field-label" style={{ marginBottom: 8 }}>{t('category.icon')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: 8, maxHeight: 140, overflowY: 'auto' }}>
          {ICON_KEYS.map((key) => {
            const active = icon === key;
            return (
              <button key={key} type="button" onClick={() => setIcon(key)} aria-label={key}
                style={{
                  display: 'grid', placeItems: 'center', height: 40, borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${active ? color : 'var(--border-2)'}`,
                  background: active ? `${color}1a` : 'var(--surface-2)',
                  color: active ? color : 'var(--text-3)',
                }}>
                <IconGlyph iconKey={key} size={18} />
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div className="field-label" style={{ marginBottom: 8 }}>{t('category.color')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORY_COLORS.map((c) => (
            <button key={c} type="button" onClick={() => setColor(c)} aria-label={c}
              style={{
                width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', background: c,
                border: color === c ? '3px solid var(--text-1)' : '3px solid transparent',
              }} />
          ))}
        </div>
      </div>

      <Button type="submit" variant="primary" style={{ width: '100%' }}>
        {editing ? t('action.saveChanges') : t('category.add')}
      </Button>
    </form>
  );
}

export default function CategoryModal({ open, onClose, editing, defaultType }) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} title={editing ? t('category.edit') : t('category.add')} maxWidth={460}>
      {open && <CategoryForm key={editing?.name ?? 'new'} editing={editing} defaultType={defaultType} onClose={onClose} />}
    </Modal>
  );
}
