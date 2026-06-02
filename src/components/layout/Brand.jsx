import { FiTrendingUp } from 'react-icons/fi';
import { APP } from '../../constants/config';

/**
 * Brand mark + wordmark, shared by sidebar and mobile topbar/drawer.
 */
export default function Brand({ compact = false }) {
  return (
    <div className="brand" style={compact ? { border: 'none', padding: '4px 6px', marginBottom: 0 } : undefined}>
      <span className="brand-mark"><FiTrendingUp size={18} /></span>
      <span>{APP.name}<span className="brand-dot">{APP.brandDot}</span></span>
    </div>
  );
}
