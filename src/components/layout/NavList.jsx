import { ROUTES } from '../../app/routes';
import { useT } from '../../i18n/i18n-context';

/**
 * Shared navigation list used by both the desktop sidebar and mobile drawer.
 * `idPrefix` keeps element ids unique across the two instances (valid HTML);
 * the desktop sidebar keeps the canonical `nav-<id>` ids.
 */
export default function NavList({ current, onNavigate, idPrefix = '' }) {
  const t = useT();
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div className="nav-group-label">{t('nav.menu')}</div>
      {ROUTES.map(({ id, labelKey, icon: Icon }) => (
        <button
          key={id}
          id={`${idPrefix}nav-${id}`}
          className={`nav-item ${current === id ? 'active' : ''}`}
          onClick={() => onNavigate(id)}
          aria-current={current === id ? 'page' : undefined}
        >
          <span className="nav-icon"><Icon size={18} /></span>
          {t(labelKey)}
        </button>
      ))}
    </nav>
  );
}
