import { ROUTES } from '../../app/routes';
import { useT } from '../../i18n/i18n-context';

/**
 * Shared navigation list used by both the desktop sidebar and mobile drawer.
 */
export default function NavList({ current, onNavigate }) {
  const t = useT();
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div className="nav-group-label">{t('nav.menu')}</div>
      {ROUTES.map(({ id, labelKey, icon: Icon }) => (
        <button
          key={id}
          id={`nav-${id}`}
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
