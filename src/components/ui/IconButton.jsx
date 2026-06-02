/**
 * IconButton — compact icon-only button. `danger` tints the hover state red.
 */
export default function IconButton({ danger, className = '', children, ...props }) {
  return (
    <button className={`icon-btn ${danger ? 'danger' : ''} ${className}`} {...props}>
      {children}
    </button>
  );
}
