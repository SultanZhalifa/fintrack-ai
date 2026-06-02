import { useState, useMemo, useRef } from 'react';
import { FiDownload, FiUpload } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { getRoute } from '../../app/routes';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import { filterTransactions } from '../../lib/finance';
import { exportTransactionsCSV, parseBackupJSON } from '../../lib/csv';
import TransactionFilters from './TransactionFilters';
import TransactionList from './TransactionList';
import AddTransactionButton from './AddTransactionButton';

const DEFAULT_FILTERS = { query: '', type: 'all', category: 'all', from: '', to: '', sort: 'date-desc' };

export default function TransactionsPage() {
  const route = getRoute('transactions');
  const { transactions, replaceAll } = useFinance();
  const { notify } = useToast();
  const fmt = useFormat();
  const t = useT();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const fileRef = useRef(null);

  const filtered = useMemo(() => filterTransactions(transactions, filters), [transactions, filters]);

  const total = useMemo(() => filtered.reduce((s, tx) => s + (tx.type === 'income' ? tx.amount : -tx.amount), 0), [filtered]);

  const handleExport = () => {
    if (transactions.length === 0) return notify(t('misc.nothingExport'), 'info');
    exportTransactionsCSV(filtered);
    notify(t('misc.csvExported'), 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { transactions: txs, budgets, accounts } = parseBackupJSON(reader.result);
        replaceAll(txs, budgets, accounts);
        notify(t('settings.imported', { count: txs.length }), 'success');
      } catch {
        notify(t('settings.importFailed'), 'error');
      }
    };
    reader.readAsText(file);
  };

  const actions = (
    <>
      <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} />
      <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
        <FiUpload size={15} /> {t('action.import')}
      </Button>
      <Button variant="secondary" size="sm" onClick={handleExport}>
        <FiDownload size={15} /> {t('action.export')}
      </Button>
      <AddTransactionButton />
    </>
  );

  return (
    <>
      <PageHeader title={t(route.labelKey)} subtitle={t(route.subKey)} actions={actions} />

      <TransactionFilters filters={filters} onChange={setFilters} />

      <Card animate={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <Badge>{t('tx.shownOf', { shown: filtered.length, total: transactions.length })}</Badge>
          <span className="mono-num" style={{ fontSize: '0.85rem', color: total >= 0 ? 'var(--income)' : 'var(--expense)' }}>
            {t('tx.net')}: {fmt.money(total)}
          </span>
        </div>
        <TransactionList transactions={filtered} emptyMessage={t('tx.emptyFilter')} />
      </Card>
    </>
  );
}
