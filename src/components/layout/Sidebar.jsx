import { useFinance } from '../../context/finance-context';
import { useT } from '../../i18n/i18n-context';
import Brand from './Brand';
import NavList from './NavList';

/**
 * Desktop sidebar — fixed left rail with brand, nav, and a live footer count.
 */
export default function Sidebar({ current, onNavigate }) {
  const { transactions } = useFinance();
  const t = useT();

  return (
    <aside className="sidebar">
      <Brand />
      <NavList current={current} onNavigate={onNavigate} />
      <div className="sidebar-footer">
        {t('misc.transactionsTracked', { count: transactions.length })}
      </div>
    </aside>
  );
}
