import Card from '../../components/ui/Card';
import { accountTypeMeta } from '../../constants/accounts';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';

/**
 * Dashboard net-worth widget: total across accounts + a per-account mini list.
 * Renders nothing when the user has no accounts yet (keeps the dashboard clean).
 */
export default function NetWorthWidget({ delay = 0 }) {
  const { accountBalances, netWorth } = useFinance();
  const fmt = useFormat();
  const t = useT();

  if (accountBalances.length === 0) return null;

  return (
    <Card title={t('account.netWorth')} subtitle={t('account.netWorthSub')} delay={delay}>
      <div className="mono-num" style={{ fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: '1.7rem', color: netWorth < 0 ? 'var(--expense)' : 'var(--text-1)', marginBottom: 16 }}>
        {fmt.money(netWorth)}
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {accountBalances.map((a) => {
          const { Icon, color } = accountTypeMeta(a.type);
          return (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="cat-icon" style={{ width: 32, height: 32, color, background: `${color}1a` }}><Icon size={15} /></span>
              <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-1)' }}>{a.name}</span>
              <span className="mono-num" style={{ fontSize: '0.88rem', color: a.balance < 0 ? 'var(--expense)' : 'var(--text-2)' }}>{fmt.money(a.balance)}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
