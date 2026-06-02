/**
 * Form field primitives: Field (label wrapper), Input, Select.
 */

export function Field({ label, hint, error, children }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
      {error
        ? <span className="field-error">{error}</span>
        : hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export function Input({ icon, invalid, className = '', ...props }) {
  const input = <input className={`input ${invalid ? 'invalid' : ''} ${className}`} {...props} />;
  if (!icon) return input;
  return (
    <div className="input-group">
      <span className="input-icon">{icon}</span>
      {input}
    </div>
  );
}

export function Select({ invalid, className = '', children, ...props }) {
  return (
    <select className={`select ${invalid ? 'invalid' : ''} ${className}`} {...props}>
      {children}
    </select>
  );
}
