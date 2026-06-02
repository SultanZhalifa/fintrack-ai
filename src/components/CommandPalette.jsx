import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiPlus, FiCornerDownLeft } from 'react-icons/fi';
import { ROUTES } from '../app/routes';
import { useT } from '../i18n/i18n-context';
import { useToast } from '../context/toast-context';
import { useSettings } from '../context/settings-context';

/**
 * Inner palette — fresh state per open (mounted via `key` so no reset effects).
 */
function Palette({ onClose, onNavigate, onAddTransaction }) {
  const t = useT();
  const { notify } = useToast();
  const { refreshRates } = useSettings();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const commands = useMemo(() => {
    const list = [
      { id: 'add', label: t('cmd.addTransaction'), icon: <FiPlus size={15} />, run: () => onAddTransaction() },
      ...ROUTES.map((r) => ({ id: `nav-${r.id}`, label: t('cmd.goTo', { page: t(r.labelKey) }), icon: <r.icon size={15} />, run: () => onNavigate(r.id) })),
      { id: 'rates', label: t('cmd.refreshRates'), icon: <FiSearch size={15} />, run: async () => {
        try { const d = await refreshRates(); notify(`${t('settings.ratesUpdated')} (${d})`, 'success'); }
        catch { notify(t('settings.ratesFailed'), 'error'); }
      } },
    ];
    const q = query.trim().toLowerCase();
    return q ? list.filter((c) => c.label.toLowerCase().includes(q)) : list;
  }, [query, t, onNavigate, onAddTransaction, refreshRates, notify]);

  const safeActive = Math.min(active, Math.max(0, commands.length - 1));
  const choose = (cmd) => { onClose(); cmd.run(); };

  const onChange = (e) => { setQuery(e.target.value); setActive(0); };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, commands.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (commands[safeActive]) choose(commands[safeActive]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  return (
    <motion.div
      className="cmd-palette"
      initial={{ opacity: 0, scale: 0.97, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -8 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      role="dialog" aria-modal="true"
    >
      <div className="cmd-search">
        <FiSearch size={18} style={{ color: 'var(--text-3)' }} />
        {/* autoFocus is intentional: the palette opens for immediate typing. */}
        <input
          autoFocus className="cmd-input" placeholder={t('cmd.placeholder')}
          value={query} onChange={onChange} onKeyDown={onKeyDown}
          aria-label={t('cmd.placeholder')}
        />
      </div>
      <div className="cmd-list">
        {commands.length === 0 ? (
          <div className="cmd-empty">{t('cmd.empty')}</div>
        ) : commands.map((cmd, i) => (
          <button
            key={cmd.id}
            className={`cmd-item ${i === safeActive ? 'active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onClick={() => choose(cmd)}
          >
            <span className="cmd-item-icon">{cmd.icon}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{cmd.label}</span>
            {i === safeActive && <FiCornerDownLeft size={14} style={{ color: 'var(--text-3)' }} />}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Command palette (Ctrl/Cmd-K): fuzzy-search navigation + quick actions.
 * Controlled by AppLayout, which also owns navigation + the add-transaction modal.
 */
export default function CommandPalette({ open, onClose, onNavigate, onAddTransaction }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '12vh' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <Palette onClose={onClose} onNavigate={onNavigate} onAddTransaction={onAddTransaction} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
