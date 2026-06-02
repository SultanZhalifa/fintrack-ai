import { useState } from 'react';
import { FiPlus, FiTarget } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ProgressBar from '../../components/ui/ProgressBar';
import { getRoute } from '../../app/routes';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import BudgetCard from './BudgetCard';
import BudgetModal from './BudgetModal';
import SmartBudgetCard from './SmartBudgetCard';

export default function BudgetsPage() {
  const route = getRoute('budgets');
  const { budgetStatus, removeBudget } = useFinance();
  const { notify } = useToast();
  const fmt = useFormat();
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const totalBudget = budgetStatus.reduce((s, b) => s + b.budget, 0);
  const totalSpent = budgetStatus.reduce((s, b) => s + b.spent, 0);
  const overallPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (cat) => { setEditing(cat); setModalOpen(true); };

  const confirmRemove = () => {
    removeBudget(deleting);
    notify(t('budget.removed.toast'), 'info');
  };

  const actions = (
    <Button variant="primary" onClick={openAdd}><FiPlus size={16} /> {t('budget.set')}</Button>
  );

  return (
    <>
      <PageHeader title={t(route.labelKey)} subtitle={t(route.subKey)} actions={actions} />

      {budgetStatus.length > 0 && (
        <div className="two-col" style={{ marginBottom: 16 }}>
          <SmartBudgetCard delay={0.02} />
          <Card title={t('budget.overall')} subtitle={t('budget.overallSub', { spent: fmt.money(totalSpent), total: fmt.money(totalBudget) })} className="card-hover" delay={0.04}>
            <ProgressBar value={Math.min(overallPct, 100)} color={overallPct > 100 ? 'var(--expense)' : overallPct > 80 ? 'var(--warning)' : 'var(--accent)'} />
            <div style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--text-3)' }} className="mono-num">
              {t('budget.ofTotal', { pct: Math.round(overallPct) })}
            </div>
          </Card>
        </div>
      )}

      {budgetStatus.length === 0 ? (
        <Card animate={false}>
          <EmptyState
            icon={<FiTarget />}
            title={t('budget.none')}
            message={t('budget.noneSub')}
            action={<Button variant="primary" onClick={openAdd}><FiPlus size={16} /> {t('budget.setFirst')}</Button>}
          />
        </Card>
      ) : (
        <div className="two-col">
          {budgetStatus.map((status, i) => (
            <BudgetCard key={status.category} status={status} index={i} onEdit={openEdit} onDelete={setDeleting} />
          ))}
        </div>
      )}

      <BudgetModal open={modalOpen} editing={editing} onClose={() => setModalOpen(false)} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmRemove}
        title={t('budget.removeTitle')}
        message={deleting ? t('budget.removeConfirm', { category: deleting }) : ''}
        confirmLabel={t('action.remove')}
      />
    </>
  );
}
