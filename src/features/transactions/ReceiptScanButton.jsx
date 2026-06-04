import { useState, useRef } from 'react';
import { FiCamera, FiLoader } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import TransactionModal from './TransactionModal';
import { useFinance } from '../../context/finance-context';
import { useToast } from '../../context/toast-context';
import { useSettings } from '../../context/settings-context';
import { useT } from '../../i18n/i18n-context';
import { categoriesOfType } from '../../constants/categories';
import { scanReceipt, hasCloudEngine, ENGINE } from '../../lib/receipt';
import { convertFromBase } from '../../lib/currency';

/**
 * Scan a receipt photo → detect fields → open the Add Transaction modal
 * pre-filled for the user to review and save. Uses Gemini Vision when a key is
 * set, otherwise on-device OCR. The image is never persisted.
 */
export default function ReceiptScanButton() {
  const { categories } = useFinance();
  const { notify } = useToast();
  const { baseCurrency, rates } = useSettings();
  const t = useT();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [prefill, setPrefill] = useState(null);

  const pick = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setBusy(true);
    notify(hasCloudEngine ? t('receipt.readingCloud') : t('receipt.readingDevice'), 'info', 6000);
    try {
      const names = categoriesOfType(categories, 'expense').map((c) => c.name);
      const r = await scanReceipt(file, names);

      // Convert the detected IDR-base total into the user's display currency for the form.
      const amountDisplay = r.total > 0
        ? String(Math.round(convertFromBase(r.total, baseCurrency, rates) * 100) / 100)
        : '';
      // Only keep a category the user actually has.
      const validCategory = names.includes(r.category) ? r.category : '';

      setPrefill({
        key: `scan-${Date.now()}`,
        type: 'expense',
        amount: amountDisplay,
        date: r.date || undefined,
        note: r.merchant || '',
        category: validCategory,
      });
      notify(r.engine === ENGINE.gemini ? t('receipt.successCloud') : t('receipt.successDevice'), 'success');
    } catch {
      notify(t('receipt.failed'), 'error');
      setPrefill({ key: `scan-fail-${Date.now()}` }); // open empty modal for manual entry
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFile}
      />
      <Button variant="secondary" size="sm" onClick={pick} disabled={busy} title={hasCloudEngine ? t('receipt.privacyCloud') : t('receipt.privacyDevice')}>
        {busy ? <FiLoader size={15} className="spin" /> : <FiCamera size={15} />}
        {t('receipt.scan')}
      </Button>

      <TransactionModal open={!!prefill} prefill={prefill} onClose={() => setPrefill(null)} />
    </>
  );
}
