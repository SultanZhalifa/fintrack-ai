import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import MobileNav from '../components/layout/MobileNav';
import CommandPalette from '../components/CommandPalette';
import TransactionModal from '../features/transactions/TransactionModal';
import { ROUTES, getRoute } from './routes';

/**
 * AppLayout — responsive shell: desktop sidebar + mobile drawer + page switch,
 * plus a global command palette (Ctrl/Cmd-K) and quick add-transaction modal.
 */
export default function AppLayout() {
  const [page, setPage] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const { Component } = getRoute(page);

  // Global Ctrl/Cmd-K to toggle the command palette.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar current={page} onNavigate={setPage} />

      <div className="content-area">
        <MobileNav current={page} onNavigate={setPage} open={drawerOpen} setOpen={setDrawerOpen} />

        <main className="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Component />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={setPage}
        onAddTransaction={() => setAddOpen(true)}
      />
      <TransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

export { ROUTES };
