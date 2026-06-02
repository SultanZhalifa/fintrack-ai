import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FiPieChart } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import { CHART_COLORS } from '../../constants/config';
import { makeDoughnutOptions } from './chartConfig';

export default function CategoryChart({ delay = 0 }) {
  const { breakdown } = useFinance();
  const fmt = useFormat();
  const t = useT();
  const options = useMemo(() => makeDoughnutOptions(fmt), [fmt]);

  const body = breakdown.length === 0 ? (
    <EmptyState icon={<FiPieChart />} title={t('chart.noExpenses')} message={t('chart.noExpensesSub')} />
  ) : (
    <div style={{ height: 230 }}>
      <Doughnut
        data={{
          labels: breakdown.map((b) => b.cat),
          datasets: [{
            data: breakdown.map((b) => b.total),
            backgroundColor: CHART_COLORS.slice(0, breakdown.length),
            borderColor: '#FFFFFF',
            borderWidth: 3,
            hoverOffset: 6,
          }],
        }}
        options={options}
      />
    </div>
  );

  return (
    <Card title={t('chart.breakdown')} subtitle={t('chart.byCategory')} delay={delay}>
      {body}
    </Card>
  );
}
