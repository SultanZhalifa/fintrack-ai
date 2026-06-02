import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import IconButton from '../../components/ui/IconButton';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useT } from '../../i18n/i18n-context';
import { createElement } from 'react';
import { resolveIcon } from '../../constants/categoryIcons';
import CategoryModal from './CategoryModal';

/** Render a registry icon by key (avoids assigning a component to a local var). */
const IconGlyph = ({ iconKey, size }) => createElement(resolveIcon(iconKey), { size });

function Chip({ cat, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
      <span className="cat-icon" style={{ width: 32, height: 32, color: cat.color, background: `${cat.color}1a` }}><IconGlyph iconKey={cat.icon} size={15} /></span>
      <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-1)' }}>{cat.name}</span>
      <IconButton aria-label="edit" onClick={() => onEdit(cat)}><FiEdit2 size={14} /></IconButton>
      <IconButton danger aria-label="remove" onClick={() => onDelete(cat)}><FiTrash2 size={14} /></IconButton>
    </div>
  );
}

export default function CategoriesManager() {
  const { categories, removeCategory } = useFinance();
  const { notify } = useToast();
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [defaultType, setDefaultType] = useState('expense');
  const [deleting, setDeleting] = useState(null);

  const openAdd = (type) => { setEditing(null); setDefaultType(type); setModalOpen(true); };
  const openEdit = (cat) => { setEditing(cat); setModalOpen(true); };

  const confirmDelete = () => {
    removeCategory(deleting.name);
    notify(t('category.removed'), 'info');
  };

  const income = categories.filter((c) => c.type === 'income');
  const expense = categories.filter((c) => c.type === 'expense');

  const renderGroup = (titleKey, list, type) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="field-label">{t(titleKey)}</div>
        <Button variant="ghost" size="sm" onClick={() => openAdd(type)}><FiPlus size={14} /> {t('category.add')}</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
        {list.map((c) => <Chip key={c.name} cat={c} onEdit={openEdit} onDelete={setDeleting} />)}
      </div>
    </div>
  );

  return (
    <Card title={t('settings.categories')} subtitle={t('settings.categoriesSub')} style={{ marginBottom: 16 }} animate={false}>
      {renderGroup('category.expense', expense, 'expense')}
      {renderGroup('category.income', income, 'income')}

      <CategoryModal open={modalOpen} editing={editing} defaultType={defaultType} onClose={() => setModalOpen(false)} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={t('category.removeTitle')}
        message={deleting ? t('category.removeConfirm', { name: deleting.name }) : ''}
        confirmLabel={t('action.remove')}
      />
    </Card>
  );
}
