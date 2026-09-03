import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div style={{ textAlign: 'center', padding: '8px 4px 16px 4px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: isDestructive ? 'rgba(201, 74, 74, 0.12)' : 'rgba(201, 162, 39, 0.12)',
            border: isDestructive ? '1px solid rgba(201, 74, 74, 0.3)' : '1px solid rgba(201, 162, 39, 0.3)',
            color: isDestructive ? '#C94A4A' : '#C9A227',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px auto',
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <h3
          className="font-serif"
          style={{ fontSize: '1.35rem', fontWeight: 600, color: '#171717', marginBottom: '8px' }}
        >
          {title}
        </h3>

        <p style={{ fontSize: '0.9rem', color: '#6F6A62', lineHeight: 1.5, marginBottom: '24px' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            className="btn-gold-outline"
            style={{ flex: 1, padding: '10px 18px' }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              flex: 1,
              padding: '10px 18px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#FFFFFF',
              backgroundColor: isDestructive ? '#C94A4A' : '#C9A227',
              boxShadow: isDestructive
                ? '0 4px 14px rgba(201, 74, 74, 0.25)'
                : '0 4px 14px rgba(201, 162, 39, 0.25)',
              transition: 'all 0.2s',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
