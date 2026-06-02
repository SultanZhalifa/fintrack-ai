/**
 * Shared Chart.js registration + warm-light theme defaults.
 * Options are built per-render via factories so currency formatting reflects
 * the user's current display currency + live rates.
 */
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler,
);

const GRID = '#ECE2D6';
const TICK = '#998A7B';

const tooltip = {
  backgroundColor: '#3A322B',
  borderColor: '#3A322B',
  titleColor: '#D2C2AE',
  bodyColor: '#FFFFFF',
  padding: 12,
  cornerRadius: 8,
  displayColors: false,
  bodyFont: { family: 'Space Grotesk', size: 13, weight: '600' },
  titleFont: { family: 'Inter', size: 11 },
};

/**
 * Axis chart (bar / line) options.
 * @param {{ money: Function, compact: Function }} fmt bound currency formatters
 */
export function makeAxisOptions(fmt) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltip, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmt.money(ctx.parsed.y)}` } },
    },
    scales: {
      x: { grid: { display: false }, border: { color: GRID }, ticks: { color: TICK, font: { size: 11 } } },
      y: {
        grid: { color: GRID, drawBorder: false },
        border: { display: false },
        ticks: { color: TICK, font: { size: 11 }, callback: (v) => fmt.compact(v) },
      },
    },
  };
}

/** Doughnut options. @param {{ money: Function }} fmt */
export function makeDoughnutOptions(fmt) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#6B5E52', font: { size: 12 }, boxWidth: 10, boxHeight: 10, padding: 14, usePointStyle: true },
      },
      tooltip: { ...tooltip, callbacks: { label: (ctx) => ` ${fmt.money(ctx.parsed)}` } },
    },
  };
}
