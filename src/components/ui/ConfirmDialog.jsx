import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmDialog — yes/no confirmation built on Modal.
 */
export default function ConfirmDialog({
  open, onClose, onConfirm, title = 'Are you sure?', message,
  confirmLabel = 'Confirm', danger = true,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth={420}>
      {message && <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: 24 }}>{message}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          onClick={() => { onConfirm(); onClose(); }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
