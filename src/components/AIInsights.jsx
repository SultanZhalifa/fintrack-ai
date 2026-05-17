import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiLoader } from 'react-icons/fi';
import { getSummary, getCategoryBreakdown } from '../store';

function fmt(n) { return 'Rp ' + n.toLocaleString('id-ID'); }

// Gemini API — replace with your actual API key
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || '';

async function askGemini(prompt) {
  if (!GEMINI_KEY) {
    // Offline fallback — simulates response without API
    await new Promise(r => setTimeout(r, 1200));
    return FALLBACK;
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
}

const FALLBACK = `Based on your spending data:

1. HOUSING is your biggest expense. If it's above 30% of income, consider ways to reduce.

2. FOOD spending looks manageable — keep tracking weekly to spot trends.

3. Your current savings rate is healthy. Aim to invest at least 10% monthly.

4. ENTERTAINMENT & SUBSCRIPTIONS can creep up — audit your subscriptions quarterly.

5. Consider building a 3-month emergency fund if you haven't already.

Overall: your spending patterns look controlled. Focus on increasing income streams alongside current expense management.`;

export default function AIInsights({ transactions }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setInsight('');

    const { income, expense, balance } = getSummary(transactions);
    const breakdown = getCategoryBreakdown(transactions);
    const savingsRate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;

    const prompt = `You are a personal finance advisor. Analyze this spending data and give 5 concise, actionable insights in plain text (no markdown formatting):

Financial Summary:
- Total Income: ${fmt(income)}
- Total Expenses: ${fmt(expense)}
- Balance: ${fmt(balance)}
- Savings Rate: ${savingsRate}%

Expense Breakdown:
${breakdown.map(b => `- ${b.cat}: ${fmt(b.total)}`).join('\n')}

Give advice that is realistic, specific, and encouraging. Keep each point to 1-2 sentences.`;

    const result = await askGemini(prompt);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: insight ? '16px' : '0' }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiZap size={14} style={{ color: '#888' }} />
            AI Spending Insights
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
            {GEMINI_KEY ? 'Powered by Gemini' : 'Offline demo mode'}
          </div>
        </div>
        <button
          id="ai-analyze-btn"
          className="btn btn-ghost"
          onClick={handleAnalyze}
          disabled={loading || transactions.length === 0}
          style={{ fontSize: '0.8rem', gap: '6px' }}
        >
          {loading ? <><FiLoader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <><FiZap size={13} /> Analyze</>}
        </button>
      </div>

      {insight && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="ai-box"
        >
          {insight}
        </motion.div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
