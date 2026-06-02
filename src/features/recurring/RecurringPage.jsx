import { useState } from 'react';
import { FiPlus, FiRepeat } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { getRoute } from '../../app/routes';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useT } from '../../i18n/i18n-context';
import RecurringList from './RecurringList';
import RecurringModal from './RecurringModal';
import ForecastWidget from './ForecastWidget';

export default function RecurringPage() {
  const route = getRoute('recurring');
  const { recurringsDetailed, removeRecurring } = useFinance();
  const { notify } = useToast();
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setModalOpen(true); };

  const confirmDelete = () => {
    removeRecurring(deleting.id);
    notify(t('recurring.removed'), 'info');
  };

  const actions = <Button variant="primary" onClick={openAdd}><FiPlus size={16} /> {t('recurring.add')}</Button>;

  return (
    <>
      <PageHeader title={t(route.labelKey)} subtitle={t(route.subKey)} actions={actions} />

      <div className="two-col" style={{ marginBottom: 16 }}>
        <ForecastWidget delay={0.04} />
        <Card title={t('nav.recurring')} subtitle={t('page.recurring.sub')} delay={0.08} animate>
          {recurringsDetailed.length === 0 ? (
            <EmptyState
              icon={<FiRepeat />}
              title={t('recurring.none')}
              message={t('recurring.noneSub')}
              action={<Button variant="primary" onClick={openAdd}><FiPlus size={16} /> {t('recurring.addFirst')}</Button>}
            />
          ) : (
            <RecurringList items={recurringsDetailed} onEdit={openEdit} onDelete={setDeleting} />
          )}
        </Card>
      </div>

      <RecurringModal open={modalOpen} editing={editing} onClose={() => setModalOpen(false)} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={t('recurring.removeTitle')}
        message={deleting ? t('recurring.removeConfirm', { name: deleting.note || deleting.category }) : ''}
        confirmLabel={t('action.remove')}
      />
    </>
  );
}
