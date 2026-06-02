import { FiSearch } from 'react-icons/fi';
import { Input, Select } from '../../components/ui/Field';
import { useFinance } from '../../context/finance-context';
import { useT } from '../../i18n/i18n-context';

const SORTS = [
  { value: 'date-desc', key: 'tx.sort.newest' },
  { value: 'date-asc', key: 'tx.sort.oldest' },
  { value: 'amount-desc', key: 'tx.sort.highest' },
  { value: 'amount-asc', key: 'tx.sort.lowest' },
];

/**
 * Filter bar for the Transactions page. Controlled via `filters` + `onChange`.
 */
export default function TransactionFilters({ filters, onChange }) {
  const t = useT();
  const { categories } = useFinance();
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="card" style={{ marginBottom: 16, display: 'grid', gap: 12 }}>
      <Input
        icon={<FiSearch size={16} />}
        placeholder={t('tx.search')}
        value={filters.query}
        onChange={set('query')}
        aria-label={t('tx.search')}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
        <Select value={filters.type} onChange={set('type')} aria-label={t('tx.allTypes')}>
          <option value="all">{t('tx.allTypes')}</option>
          <option value="income">{t('chart.income')}</option>
          <option value="expense">{t('chart.expense')}</option>
        </Select>
        <Select value={filters.category} onChange={set('category')} aria-label={t('tx.allCategories')}>
          <option value="all">{t('tx.allCategories')}</option>
          {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </Select>
        <Select value={filters.sort} onChange={set('sort')} aria-label={t('tx.sort.newest')}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{t(s.key)}</option>)}
        </Select>
        <Input type="date" value={filters.from} onChange={set('from')} aria-label={t('tx.date')} title={t('tx.date')} />
        <Input type="date" value={filters.to} onChange={set('to')} aria-label={t('tx.date')} title={t('tx.date')} />
      </div>
    </div>
  );
}
