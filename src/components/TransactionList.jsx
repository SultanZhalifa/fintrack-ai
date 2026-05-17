import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiChevronDown } from 'react-icons/fi';
import { CATEGORY_ICONS, remove } from '../store';
import { format } from 'date-fns';

function fmt(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function TransactionList({ transactions, onDelete, limit }) {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);

  const filtered = transactions.filter(t => filter === 'all' ? true : t.type === filter);
  const shown    = expanded || !limit ? filtered : filtered.slice(0, limit);
  const hasMore  = limit && filtered.length > limit && !expanded;

  if (transactions.length === 0) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.875rem' }}>
        No transactions yet. Add your first one.
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['all', 'income', 'expense'].map(f => (
          <button
            key={f}
            id={`filter-${f}-btn`}
            onClick={() => setFilter(f)}
            className={`tag ${f === 'income' && filter === f ? 'tag-green' : f === 'expense' && filter === f ? 'tag-red' : ''}`}
            style={{ cursor: 'pointer', border: '1px solid', borderColor: filter === f ? 'inherit' : 'var(--border)', background: filter === f ? 'inherit' : 'var(--bg-4)', fontFamily: 'var(--font)', transition: 'all 0.15s', textTransform: 'capitalize', padding: '5px 12px', fontSize: '0.78rem' }}
          >
            {f}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {shown.map(tx => (
          <motion.div
            key={tx.id}
            className="tx-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="tx-icon">
              {CATEGORY_ICONS[tx.category] || '📦'}
            </div>
            <div className="tx-info">
              <div className="tx-name">{tx.note || tx.category}</div>
              <div className="tx-meta">
                {tx.category} &middot; {format(new Date(tx.date), 'MMM d, yyyy')}
              </div>
            </div>
            <div className={`tx-amount ${tx.type === 'income' ? 'amount-pos' : 'amount-neg'}`}>
              {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
            </div>
            <button
              id={`delete-tx-${tx.id}`}
              onClick={() => { remove(tx.id); onDelete(); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}
            >
              <FiTrash2 size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setExpanded(true)}
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center', marginTop: '12px', fontSize: '0.8rem' }}
        >
          <FiChevronDown size={14} /> Show {filtered.length - limit} more
        </button>
      )}

      {filtered.length === 0 && (
        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.85rem' }}>
          No {filter} transactions found.
        </div>
      )}
    </div>
  );
}
