/**
 * Button — variants: primary | secondary | ghost | danger. Supports `size="sm"`.
 */
export default function Button({
  variant = 'secondary', size, className = '', children, ...props
}) {
  const classes = ['btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
