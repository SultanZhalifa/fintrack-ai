import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getMonthlyData, getCategoryBreakdown } from '../store';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler
);

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#111',
      borderColor: '#252525',
      borderWidth: 1,
      titleColor: '#888',
      bodyColor: '#fff',
      padding: 12,
      callbacks: {
        label: ctx => ' Rp ' + ctx.parsed.y.toLocaleString('id-ID'),
      },
    },
  },
  scales: {
    x: { grid: { color: '#111' }, ticks: { color: '#444', font: { size: 11 } } },
    y: {
      grid: { color: '#111' }, ticks: {
        color: '#444', font: { size: 11 },
        callback: v => 'Rp ' + (v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : (v / 1000).toFixed(0) + 'K'),
      },
    },
  },
};

export function MonthlyChart({ transactions }) {
  const data = getMonthlyData(transactions);
  const labels = data.map(d => d.month);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: data.map(d => d.income),
        backgroundColor: 'rgba(34,197,94,0.15)',
        borderColor: '#22c55e',
        borderWidth: 1.5,
        borderRadius: 4,
      },
      {
        label: 'Expense',
        data: data.map(d => d.expense),
        backgroundColor: 'rgba(239,68,68,0.12)',
        borderColor: '#ef4444',
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="card" style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.95rem', fontWeight: 700 }}>Monthly Overview</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>Last 6 months</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[['Income','#22c55e'],['Expense','#ef4444']].map(([l,c]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'0.75rem', color:'var(--text-2)' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'2px', background:c }} />
              {l}
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: '220px' }}>
        <Bar data={chartData} options={chartOpts} />
      </div>
    </div>
  );
}

const DOUGHNUT_COLORS = ['#fff','#888','#555','#333','#222','#aaa','#666','#444','#2a2a2a'];

export function CategoryChart({ transactions }) {
  const breakdown = getCategoryBreakdown(transactions);
  if (breakdown.length === 0) return null;

  const chartData = {
    labels: breakdown.map(b => b.cat),
    datasets: [{
      data: breakdown.map(b => b.total),
      backgroundColor: DOUGHNUT_COLORS.slice(0, breakdown.length),
      borderColor: '#0f0f0f',
      borderWidth: 2,
    }],
  };

  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#555', font: { size: 11 }, boxWidth: 10, padding: 12 },
      },
      tooltip: {
        backgroundColor: '#111',
        borderColor: '#252525',
        borderWidth: 1,
        titleColor: '#888',
        bodyColor: '#fff',
        padding: 12,
        callbacks: {
          label: ctx => ' Rp ' + ctx.parsed.toLocaleString('id-ID'),
        },
      },
    },
  };

  return (
    <div className="card">
      <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>Expense Breakdown</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '20px' }}>By category</div>
      <div style={{ height: '200px' }}>
        <Doughnut data={chartData} options={opts} />
      </div>
    </div>
  );
}
