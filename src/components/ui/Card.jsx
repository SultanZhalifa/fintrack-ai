import { motion } from 'framer-motion';

/**
 * Card — surface container with optional title/subtitle/action header.
 * Set `hover` for an interactive lift, `as="motion"` is implied via animation props.
 */
export default function Card({
  title, subtitle, action, hover, className = '', children, delay = 0, animate = true, ...props
}) {
  const content = (
    <>
      {(title || action) && (
        <div className="card-head">
          <div>
            {title && <div className="card-title">{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </>
  );

  const classes = `card ${hover ? 'card-hover' : ''} ${className}`.trim();

  if (!animate) {
    return <div className={classes} {...props}>{content}</div>;
  }

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {content}
    </motion.div>
  );
}
