import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { ToastContext } from './toast-context';

const ICONS = {
  success: <FiCheckCircle size={16} />,
  error:   <FiAlertCircle size={16} />,
  info:    <FiInfo size={16} />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, type }]);
    if (duration) setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="toast-wrap" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`toast ${t.type}`}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span className={`toast-icon text-${t.type === 'error' ? 'expense' : t.type === 'success' ? 'income' : ''}`}>
                {ICONS[t.type]}
              </span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => dismiss(t.id)} aria-label="Dismiss">
                <FiX size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
