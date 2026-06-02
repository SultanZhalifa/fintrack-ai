import { useState, useRef } from 'react';
import { FiDollarSign, FiGlobe, FiRefreshCw, FiDownload, FiUpload, FiTrash2, FiDatabase, FiLoader } from 'react-icons/fi';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Select } from '../../components/ui/Field';
import { getRoute } from '../../app/routes';
import { useSettings } from '../../context/settings-context';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useT } from '../../i18n/i18n-context';
import { CURRENCIES } from '../../constants/config';
import { exportBackupJSON, parseBackupJSON } from '../../lib/csv';

const LANGUAGES = [{ code: 'id', label: 'Bahasa Indonesia' }, { code: 'en', label: 'English' }];

function Row({ icon, title, sub, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <span className="stat-icon" style={{ background: 'var(--surface-3)', color: 'var(--accent)' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontWeight: 600, color: 'var(--text-1)' }}>{title}</div>
        <div className="card-subtitle">{sub}</div>
      </div>
      <div style={{ minWidth: 200 }}>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const route = getRoute('settings');
  const { baseCurrency, language, ratesUpdatedAt, rates, setBaseCurrency, setLanguage, refreshRates } = useSettings();
  const { transactions, budgets, accounts, clearAll, replaceAll } = useFinance();
  const { notify } = useToast();
  const t = useT();
  const [refreshing, setRefreshing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileRef = useRef(null);

  const hasLiveRates = Object.keys(rates || {}).length > 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const date = await refreshRates();
      notify(`${t('settings.ratesUpdated')} (${date})`, 'success');
    } catch {
      notify(t('settings.ratesFailed'), 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = () => {
    exportBackupJSON({ transactions, budgets, accounts });
    notify(t('settings.exported'), 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseBackupJSON(reader.result);
        replaceAll(parsed.transactions, parsed.budgets, parsed.accounts);
        notify(t('settings.imported', { count: parsed.transactions.length }), 'success');
      } catch {
        notify(t('settings.importFailed'), 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    clearAll();
    notify(t('settings.cleared'), 'info');
  };

  return (
    <>
      <PageHeader title={t(route.labelKey)} subtitle={t(route.subKey)} />

      <Card title={t('settings.currency')} subtitle={t('settings.currencySub')} style={{ marginBottom: 16 }}>
        <Row icon={<FiDollarSign size={18} />} title={t('settings.currency')} sub={t('settings.currencySub')}>
          <Select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} aria-label={t('settings.currency')}>
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.symbol}</option>
            ))}
          </Select>
        </Row>
        <div style={{ height: 1, background: 'var(--border)', margin: '18px 0' }} />
        <Row
          icon={<FiRefreshCw size={18} />}
          title={t('settings.rates')}
          sub={hasLiveRates && ratesUpdatedAt ? t('settings.ratesLive', { date: ratesUpdatedAt }) : t('settings.ratesStored')}
        >
          <Button variant="secondary" onClick={handleRefresh} disabled={refreshing} style={{ width: '100%' }}>
            {refreshing
              ? <><FiLoader size={15} className="spin" /> {t('settings.refreshing')}</>
              : <><FiRefreshCw size={15} /> {t('settings.refreshRates')}</>}
          </Button>
        </Row>
      </Card>

      <Card title={t('settings.language')} subtitle={t('settings.languageSub')} style={{ marginBottom: 16 }}>
        <Row icon={<FiGlobe size={18} />} title={t('settings.language')} sub={t('settings.languageSub')}>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label={t('settings.language')}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </Select>
        </Row>
      </Card>

      <Card title={t('settings.data')} subtitle={t('settings.dataSub')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <FiDatabase size={16} style={{ color: 'var(--text-3)' }} />
          <Badge>{t('misc.transactionsTracked', { count: transactions.length })}</Badge>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} />
          <Button variant="secondary" onClick={handleExport}><FiDownload size={15} /> {t('settings.exportBackup')}</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}><FiUpload size={15} /> {t('settings.importBackup')}</Button>
          <Button variant="danger" onClick={() => setConfirmClear(true)}><FiTrash2 size={15} /> {t('settings.clearAll')}</Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClear}
        title={t('settings.clearTitle')}
        message={t('settings.clearConfirm')}
        confirmLabel={t('settings.clearAll')}
      />
    </>
  );
}
