import PageHeader from '../../components/layout/PageHeader';
import { getRoute } from '../../app/routes';
import { useT } from '../../i18n/i18n-context';
import StatCards from '../dashboard/StatCards';
import HealthScoreCard from './HealthScoreCard';
import InsightCards from './InsightCards';
import AIInsights from './AIInsights';

export default function InsightsPage() {
  const route = getRoute('insights');
  const t = useT();
  return (
    <>
      <PageHeader title={t(route.labelKey)} subtitle={t(route.subKey)} />
      <StatCards />
      <div style={{ height: 16 }} />
      <div className="two-col" style={{ marginBottom: 16 }}>
        <HealthScoreCard delay={0.04} />
        <InsightCards delay={0.08} />
      </div>
      <AIInsights />
    </>
  );
}
