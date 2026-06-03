import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import { useEffect } from 'react';
import Brand from './Brand';
import NavList from './NavList';
import IconButton from '../ui/IconButton';

/**
 * Mobile topbar + off-canvas drawer navigation (visible < 768px via CSS).
 */
export default function MobileNav({ current, onNavigate, open, setOpen }) {
  // Lock scroll while drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleNavigate = (id) => { onNavigate(id); setOpen(false); };

  return (
    <>
      <header className="topbar">
        <Brand compact />
        <IconButton onClick={() => setOpen(true)} aria-label="Open menu">
          <FiMenu size={20} />
        </IconButton>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="drawer-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Brand />
              <NavList current={current} onNavigate={handleNavigate} idPrefix="drawer-" />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
