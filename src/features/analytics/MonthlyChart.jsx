import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import Card from '../../components/ui/Card';
import { useFinance } from '../../context/finance-context';
import { useFormat } from '../../hooks/useFormat';
import { useT } from '../../i18n/i18n-context';
import { INCOME_COLOR, EXPENSE_COLOR } from '../../constants/config';
import { makeAxisOptions } from './chartConfig';

function Legend({ incomeLabel, expenseLabel }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      {[[incomeLabel, INCOME_COLOR], [expenseLabel, EXPENSE_COLOR]].map(([label, color]) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-2)' }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

export default function MonthlyChart({ delay = 0 }) {
  const { monthlyData } = useFinance();
  const fmt = useFormat();
  const t = useT();
  const options = useMemo(() => makeAxisOptions(fmt), [fmt]);

  const data = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: t('chart.income'), data: monthlyData.map((d) => d.income),
        backgroundColor: INCOME_COLOR, borderRadius: 6, borderSkipped: false, maxBarThickness: 28,
      },
      {
        label: t('chart.expense'), data: monthlyData.map((d) => d.expense),
        backgroundColor: EXPENSE_COLOR, borderRadius: 6, borderSkipped: false, maxBarThickness: 28,
      },
    ],
  };

  return (
    <Card title={t('chart.monthly')} subtitle={t('chart.last6')} action={<Legend incomeLabel={t('chart.income')} expenseLabel={t('chart.expense')} />} delay={delay}>
      <div style={{ height: 240 }}>
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}
