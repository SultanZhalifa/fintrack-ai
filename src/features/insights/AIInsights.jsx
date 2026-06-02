import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiLoader, FiKey } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useFormat } from '../../hooks/useFormat';
import { useI18n } from '../../i18n/i18n-context';
import { askGemini, buildInsightPrompt, isAIEnabled } from '../../lib/gemini';

export default function AIInsights() {
  const { summary, savingsRate, breakdown, transactions } = useFinance();
  const { notify } = useToast();
  const fmt = useFormat();
  const { t, language } = useI18n();
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setInsight('');
    try {
      const prompt = buildInsightPrompt({
        income: summary.income,
        expense: summary.expense,
        balance: summary.balance,
        savingsRate,
        breakdown,
      }, fmt.money, language);
      const result = await askGemini(prompt);
      setInsight(result);
    } catch {
      notify(t('ai.failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const action = isAIEnabled ? (
    <Button variant="primary" size="sm" id="ai-analyze-btn" onClick={handleAnalyze} disabled={loading || transactions.length === 0}>
      {loading ? <><FiLoader size={14} className="spin" /> {t('ai.analyzing')}</> : <><FiZap size={14} /> {t('action.analyze')}</>}
    </Button>
  ) : null;

  return (
    <Card
      title={t('ai.title')}
      subtitle={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Badge tone={isAIEnabled ? 'income' : 'warning'}>{isAIEnabled ? t('ai.poweredBy') : t('ai.needKey')}</Badge>
        </span>
      }
      action={action}
      animate={false}
    >
      {!isAIEnabled && (
        <EmptyState icon={<FiKey />} title={t('ai.needKeyTitle')} message={t('ai.needKeySub')} />
      )}
      {isAIEnabled && !insight && !loading && (
        <EmptyState icon={<FiZap />} title={t('ai.getAdvice')} message={t('ai.getAdviceSub')} />
      )}
      {loading && (
        <div className="empty">
          <FiLoader size={28} className="spin" style={{ color: 'var(--accent)', margin: '0 auto 12px' }} />
          <div className="empty-sub">{t('ai.crunching')}</div>
        </div>
      )}
      {insight && !loading && (
        <motion.div className="ai-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {insight}
        </motion.div>
      )}
    </Card>
  );
}
