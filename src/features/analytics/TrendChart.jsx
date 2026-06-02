import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import Card from '../../components/ui/Card';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import { makeAxisOptions } from './chartConfig';

const ACCENT = '#C2703D';

export default function TrendChart({ delay = 0 }) {
  const { monthlyData } = useFinance();
  const fmt = useFormat();
  const t = useT();
  const options = useMemo(() => makeAxisOptions(fmt), [fmt]);

  const data = {
    labels: monthlyData.map((d) => d.month),
    datasets: [{
      label: t('tx.net'),
      data: monthlyData.map((d) => d.net),
      borderColor: ACCENT,
      backgroundColor: 'rgba(194,112,61,0.12)',
      fill: true,
      tension: 0.4,
      borderWidth: 2.5,
      pointBackgroundColor: ACCENT,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  return (
    <Card title={t('chart.netFlow')} subtitle={t('chart.netFlowSub')} delay={delay}>
      <div style={{ height: 240 }}>
        <Line data={data} options={options} />
      </div>
    </Card>
  );
}
