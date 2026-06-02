import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import MobileNav from '../components/layout/MobileNav';
import { ROUTES, getRoute } from './routes';

/**
 * AppLayout — responsive shell: desktop sidebar + mobile drawer + page switch.
 * Pages are animated on transition with a subtle fade/slide.
 */
export default function AppLayout() {
  const [page, setPage] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { Component } = getRoute(page);

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
    </div>
  );
}

export { ROUTES };
