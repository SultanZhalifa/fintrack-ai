import { FiHeart } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import { useFinance } from '../../context/finance-context';
import { useT } from '../../i18n/i18n-context';

const gradeColor = (grade) => ({
  excellent: 'var(--income)', good: '#6E8C7E', fair: 'var(--warning)', poor: 'var(--expense)',
}[grade] || 'var(--accent)');

/** Radial gauge rendered with an SVG ring (no emoji, no external dep). */
function Gauge({ value, color }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden>
      <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 70 70)"
        style={{ transition: 'stroke-dashoffset 0.8s var(--ease)' }}
      />
      <text x="70" y="68" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="800" fontSize="30" fill="var(--text-1)">{value}</text>
      <text x="70" y="90" textAnchor="middle" fontFamily="Inter" fontSize="12" fill="var(--text-3)">/ 100</text>
    </svg>
  );
}

export default function HealthScoreCard({ delay = 0 }) {
  const { healthScore } = useFinance();
  const t = useT();

  if (!healthScore.hasData) {
    return (
      <Card title={t('health.title')} subtitle={t('health.sub')} delay={delay}>
        <EmptyState icon={<FiHeart />} title={t('health.title')} message={t('health.needData')} />
      </Card>
    );
  }

  const color = gradeColor(healthScore.grade);

  return (
    <Card title={t('health.title')} subtitle={t('health.sub')} delay={delay}>
      <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Gauge value={healthScore.total} color={color} />
          <span className="badge" style={{ background: `${color}1a`, color }}>{t(`health.grade.${healthScore.grade}`)}</span>
        </div>
        <div style={{ flex: 1, minWidth: 200, display: 'grid', gap: 14 }}>
          {healthScore.pillars.map((p) => (
            <div key={p.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 5 }}>
                <span style={{ color: 'var(--text-2)' }}>{t(`health.pillar.${p.key}`)}</span>
                <span className="mono-num" style={{ color: 'var(--text-3)' }}>{p.score}/25</span>
              </div>
              <ProgressBar value={(p.score / 25) * 100} color={color} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
