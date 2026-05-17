import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FiGrid, FiList, FiBarChart2, FiZap, FiMenu, FiX,
} from 'react-icons/fi';
import StatCards from './components/StatCards';
import { MonthlyChart, CategoryChart } from './components/Charts';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import AIInsights from './components/AIInsights';
import { getAll, ensureSeed } from './store';
import './index.css';

ensureSeed();

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',     icon: <FiGrid size={15} /> },
  { id: 'transactions', label: 'Transactions',  icon: <FiList size={15} /> },
  { id: 'analytics',   label: 'Analytics',     icon: <FiBarChart2 size={15} /> },
  { id: 'ai',          label: 'AI Insights',   icon: <FiZap size={15} /> },
];

export default function App() {
  const [page, setPage]           = useState('dashboard');
  const [transactions, setTxs]    = useState([]);
  const [mobileNav, setMobileNav] = useState(false);

  const refresh = useCallback(() => setTxs(getAll()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const navigate = (id) => { setPage(id); setMobileNav(false); };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="nav-logo">FinTrack<span style={{ color: 'var(--text-4)' }}>.ai</span></div>
        {NAV.map(n => (
          <button
            key={n.id}
            id={`nav-${n.id}`}
            className={`nav-item ${page === n.id ? 'active' : ''}`}
            onClick={() => navigate(n.id)}
          >
            {n.icon} {n.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: '0.72rem', color: 'var(--text-4)', padding: '8px 12px' }}>
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)', padding: '14px 16px',
        justifyContent: 'space-between', alignItems: 'center',
      }} className="mobile-topbar">
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem' }}>
          FinTrack<span style={{ color: 'var(--text-4)' }}>.ai</span>
        </div>
        <button
          onClick={() => setMobileNav(!mobileNav)}
          style={{ background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer', display: 'flex' }}
        >
          {mobileNav ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileNav && (
        <div style={{
          position: 'fixed', top: '53px', left: 0, right: 0, zIndex: 499,
          background: '#080808', borderBottom: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
        }}>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => navigate(n.id)}
              style={{ borderRadius: 0, borderBottom: '1px solid var(--border)' }}
            >
              {n.icon} {n.label}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <main className="main-content" style={{ paddingTop: '40px' }}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">{NAV.find(n => n.id === page)?.label}</h1>
            <p className="page-sub">
              {page === 'dashboard'    && 'Your financial overview at a glance.'}
              {page === 'transactions' && 'All your income and expense records.'}
              {page === 'analytics'    && 'Trends and category breakdown.'}
              {page === 'ai'           && 'AI-powered personalized financial advice.'}
            </p>
          </div>
          <AddTransaction onAdd={refresh} />
        </div>

        {/* --- Dashboard --- */}
        {page === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <StatCards transactions={transactions} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,360px),1fr))', gap: '14px', marginBottom: '14px' }}>
              <MonthlyChart transactions={transactions} />
              <CategoryChart transactions={transactions} />
            </div>
            <div className="card">
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: '2px', fontSize: '0.95rem' }}>Recent Transactions</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '16px' }}>Last 5 entries</div>
              <TransactionList transactions={transactions} onDelete={refresh} limit={5} />
            </div>
          </motion.div>
        )}

        {/* --- Transactions --- */}
        {page === 'transactions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <StatCards transactions={transactions} />
            <div className="card">
              <TransactionList transactions={transactions} onDelete={refresh} />
            </div>
          </motion.div>
        )}

        {/* --- Analytics --- */}
        {page === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <MonthlyChart transactions={transactions} />
            <div style={{ height: '14px' }} />
            <CategoryChart transactions={transactions} />
          </motion.div>
        )}

        {/* --- AI Insights --- */}
        {page === 'ai' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <StatCards transactions={transactions} />
            <div style={{ height: '14px' }} />
            <AIInsights transactions={transactions} />
          </motion.div>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .mobile-topbar { display: flex !important; }
          .main-content { padding-top: 80px !important; }
        }
      `}</style>
    </div>
  );
}
