/**
 * ProgressBar — clamps value to 0–100. `color` overrides the fill (CSS color).
 */
export default function ProgressBar({ value = 0, color = 'var(--accent)' }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
