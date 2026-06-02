/**
 * EmptyState — friendly placeholder with optional icon, title, message, action.
 */
export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty">
      {icon && <div className="empty-icon">{icon}</div>}
      {title && <div className="empty-title">{title}</div>}
      {message && <div className="empty-sub">{message}</div>}
      {action}
    </div>
  );
}
