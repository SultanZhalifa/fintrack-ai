/**
 * Badge — small pill. tone: default | income | expense | warning | accent.
 */
export default function Badge({ tone = 'default', className = '', children, ...props }) {
  const toneClass = tone === 'default' ? '' : `badge-${tone}`;
  return (
    <span className={`badge ${toneClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
