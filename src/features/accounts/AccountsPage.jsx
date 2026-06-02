import { useState } from 'react';
import { FiPlus, FiRepeat, FiCreditCard } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { getRoute } from '../../app/routes';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import AccountCard from './AccountCard';
import AccountModal from './AccountModal';
import TransferModal from './TransferModal';

export default function AccountsPage() {
  const route = getRoute('accounts');
  const { accountBalances, netWorth, deleteAccount } = useFinance();
  const { notify } = useToast();
  const fmt = useFormat();
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (acc) => { setEditing(acc); setModalOpen(true); };

  const handleTransfer = () => {
    if (accountBalances.length < 2) return notify(t('account.err.needTwo'), 'info');
    setTransferOpen(true);
  };

  const confirmDelete = () => {
    deleteAccount(deleting.id);
    notify(t('account.removed'), 'info');
  };

  const actions = (
    <>
      <Button variant="secondary" size="sm" onClick={handleTransfer}><FiRepeat size={15} /> {t('account.transfer')}</Button>
      <Button variant="primary" onClick={openAdd}><FiPlus size={16} /> {t('account.add')}</Button>
    </>
  );

  return (
    <>
      <PageHeader title={t(route.labelKey)} subtitle={t(route.subKey)} actions={actions} />

      <Card className="card-hover" style={{ marginBottom: 16, background: 'linear-gradient(135deg, var(--accent-soft), var(--surface))' }} animate={false}>
        <div className="stat-label" style={{ marginBottom: 6 }}>{t('account.netWorth')}</div>
        <div className="mono-num" style={{ fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: '2rem', color: netWorth < 0 ? 'var(--expense)' : 'var(--text-1)' }}>
          {fmt.money(netWorth)}
        </div>
        <div className="card-subtitle">{t('account.netWorthSub')}</div>
      </Card>

      {accountBalances.length === 0 ? (
        <Card animate={false}>
          <EmptyState
            icon={<FiCreditCard />}
            title={t('account.none')}
            message={t('account.noneSub')}
            action={<Button variant="primary" onClick={openAdd}><FiPlus size={16} /> {t('account.addFirst')}</Button>}
          />
        </Card>
      ) : (
        <div className="two-col">
          {accountBalances.map((account, i) => (
            <AccountCard key={account.id} account={account} index={i} onEdit={openEdit} onDelete={setDeleting} />
          ))}
        </div>
      )}

      <AccountModal open={modalOpen} editing={editing} onClose={() => setModalOpen(false)} />
      <TransferModal open={transferOpen} accounts={accountBalances} onClose={() => setTransferOpen(false)} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title={t('account.removeTitle')}
        message={deleting ? t('account.removeConfirm', { name: deleting.name }) : ''}
        confirmLabel={t('action.remove')}
      />
    </>
  );
}
