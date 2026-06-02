import Card from '../../components/ui/Card';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';

function Line({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
      <span style={{ color: 'var(--text-2)' }}>{label}</span>
      <span className="mono-num" style={{ color, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/**
 * Month-end forecast: actual-so-far + scheduled recurring + estimated spending.
 */
export default function ForecastWidget({ delay = 0 }) {
  const { forecast } = useFinance();
  const fmt = useFormat();
  const t = useT();
  const { actualNet, projectedRecurring, projectedDiscretionary, projectedNet, daysLeft } = forecast;

  const signColor = (v) => (v >= 0 ? 'var(--income)' : 'var(--expense)');

  return (
    <Card title={t('forecast.title')} subtitle={t('forecast.sub')} delay={delay}>
      <div className="mono-num" style={{ fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: '1.8rem', color: signColor(projectedNet), marginBottom: 4 }}>
        {fmt.money(projectedNet)}
      </div>
      <div className="card-subtitle" style={{ marginBottom: 18 }}>{t('forecast.daysLeft', { days: daysLeft })}</div>

      <div style={{ display: 'grid', gap: 10 }}>
        <Line label={t('forecast.actual')} value={fmt.money(actualNet)} color={signColor(actualNet)} />
        <Line label={t('forecast.scheduled')} value={fmt.money(projectedRecurring)} color={signColor(projectedRecurring)} />
        <Line label={t('forecast.estimated')} value={fmt.money(projectedDiscretionary)} color={signColor(projectedDiscretionary)} />
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
        <Line label={t('forecast.projected')} value={fmt.money(projectedNet)} color={signColor(projectedNet)} />
      </div>
    </Card>
  );
}
