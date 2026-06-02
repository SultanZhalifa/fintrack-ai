import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiGlobe, FiDollarSign, FiLock, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import { useSettings } from '../../context/settings-context';
import { useT } from '../../i18n/i18n-context';
import { CURRENCIES } from '../../constants/config';

const LANGS = [{ code: 'id', label: 'Bahasa Indonesia' }, { code: 'en', label: 'English' }];

/**
 * First-run onboarding: language -> currency -> start. Sets settings and marks
 * the user onboarded. Shown only when settings.onboarded is false.
 */
export default function OnboardingFlow() {
  const { language, baseCurrency, setLanguage, setBaseCurrency, markOnboarded } = useSettings();
  const t = useT();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <FiGlobe size={22} />, title: t('onboard.chooseLanguage'),
      body: (
        <div style={{ display: 'grid', gap: 10 }}>
          {LANGS.map((l) => (
            <button key={l.code} type="button" onClick={() => setLanguage(l.code)}
              className={`onboard-choice ${language === l.code ? 'active' : ''}`}>
              {l.label}
            </button>
          ))}
        </div>
      ),
    },
    {
      icon: <FiDollarSign size={22} />, title: t('onboard.chooseCurrency'),
      body: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {Object.values(CURRENCIES).map((c) => (
            <button key={c.code} type="button" onClick={() => setBaseCurrency(c.code)}
              className={`onboard-choice ${baseCurrency === c.code ? 'active' : ''}`}>
              {c.symbol} · {c.code}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <div className="onboard-overlay">
      <motion.div className="onboard-card"
        initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <div className="onboard-brand">
          <span className="brand-mark" style={{ width: 44, height: 44 }}><FiTrendingUp size={22} /></span>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: '1.2rem' }}>{t('onboard.welcome')}</div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>{t('onboard.tagline')}</div>
          </div>
        </div>

        <div className="onboard-step-label">{t('onboard.step', { n: step + 1, total: steps.length })}</div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}>
            <div className="onboard-icon">{current.icon}</div>
            <div className="onboard-title">{current.title}</div>
            {current.body}
          </motion.div>
        </AnimatePresence>

        <div className="onboard-privacy"><FiLock size={13} /> {t('onboard.privacy')}</div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <FiArrowLeft size={15} /> {t('onboard.back')}
            </Button>
          )}
          <Button variant="primary" style={{ flex: 1 }}
            onClick={() => (isLast ? markOnboarded() : setStep((s) => s + 1))}>
            {isLast ? t('onboard.start') : t('onboard.next')} <FiArrowRight size={15} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
