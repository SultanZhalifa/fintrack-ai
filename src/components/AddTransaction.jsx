import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX } from 'react-icons/fi';
import { CATEGORIES, add } from '../store';
import { format } from 'date-fns';

export default function AddTransaction({ onAdd }) {
  const [open, setOpen]   = useState(false);
  const [type, setType]   = useState('expense');
  const [form, setForm]   = useState({
    amount: '', category: '', note: '', date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    add({ type, amount: parseFloat(form.amount), category: form.category, note: form.note, date: form.date });
    setForm({ amount: '', category: '', note: '', date: format(new Date(), 'yyyy-MM-dd') });
    setOpen(false);
    onAdd();
  };

  return (
    <>
      <button id="add-tx-btn" className="btn btn-white" onClick={() => setOpen(true)}>
        <FiPlus size={15} /> Add Transaction
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 999, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                zIndex: 1000, width: '90%', maxWidth: '480px',
                background: 'var(--bg-3)', border: '1px solid var(--border-2)',
                borderRadius: '16px', padding: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 700 }}>Add Transaction</div>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display:'flex', alignItems:'center' }}>
                  <FiX size={18} />
                </button>
              </div>

              {/* Type toggle */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {['income', 'expense'].map(t => (
                  <button
                    key={t}
                    id={`type-${t}-btn`}
                    onClick={() => { setType(t); setForm(f => ({ ...f, category: '' })); }}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
                      fontFamily: 'var(--font)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      background: type === t ? (t === 'income' ? 'var(--green-dim)' : 'var(--red-dim)') : 'var(--bg-4)',
                      borderColor: type === t ? (t === 'income' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)') : 'var(--border)',
                      color: type === t ? (t === 'income' ? 'var(--green)' : 'var(--red)') : 'var(--text-3)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid" style={{ marginBottom: '14px' }}>
                  <div className="form-group">
                    <div className="form-label">Amount (Rp)</div>
                    <input id="tx-amount" name="amount" type="number" min="1" required
                      value={form.amount} onChange={handleChange}
                      placeholder="500000" className="input" />
                  </div>
                  <div className="form-group">
                    <div className="form-label">Date</div>
                    <input id="tx-date" name="date" type="date" required
                      value={form.date} onChange={handleChange} className="input" />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <div className="form-label">Category</div>
                  <select id="tx-category" name="category" required value={form.category} onChange={handleChange} className="input">
                    <option value="">Select category</option>
                    {CATEGORIES[type].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <div className="form-label">Note (optional)</div>
                  <input id="tx-note" name="note" type="text"
                    value={form.note} onChange={handleChange}
                    placeholder="Brief description" className="input" />
                </div>

                <button id="tx-submit-btn" type="submit" className="btn btn-white" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  Save Transaction
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
