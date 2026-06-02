/**
 * Export / import helpers — CSV for spreadsheets, JSON for full backup.
 */

function triggerDownload(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const escapeCell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const stamp = () => new Date().toISOString().slice(0, 10);

/** Export transactions to a CSV file. */
export function exportTransactionsCSV(txs = []) {
  const headers = ['Date', 'Type', 'Category', 'Note', 'Amount'];
  const rows = txs.map((t) => [t.date, t.type, t.category, t.note || '', t.amount]);
  const csv = [headers, ...rows].map((r) => r.map(escapeCell).join(',')).join('\n');
  triggerDownload('﻿' + csv, `fintrack-transactions-${stamp()}.csv`, 'text/csv;charset=utf-8');
}

/** Export a full backup (transactions + budgets) as JSON. */
export function exportBackupJSON(payload) {
  triggerDownload(
    JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...payload }, null, 2),
    `fintrack-backup-${stamp()}.json`,
    'application/json',
  );
}

/** Parse a JSON backup file -> { transactions, budgets, accounts }. Throws on invalid shape. */
export function parseBackupJSON(text) {
  const data = JSON.parse(text);
  if (!Array.isArray(data.transactions)) {
    throw new Error('Invalid backup: "transactions" array missing.');
  }
  return {
    transactions: data.transactions,
    budgets: data.budgets && typeof data.budgets === 'object' ? data.budgets : {},
    accounts: Array.isArray(data.accounts) ? data.accounts : [],
  };
}
