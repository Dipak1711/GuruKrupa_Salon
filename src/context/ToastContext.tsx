import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { playLuxuryChime } from '../utils/sound';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      if (type === 'success') {
        playLuxuryChime('success');
      } else {
        playLuxuryChime('alert');
      }

      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => showToast(title, message, 'success'), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast(title, message, 'error'), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast(title, message, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '380px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(18, 22, 30, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border:
                  t.type === 'success'
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : t.type === 'error'
                    ? '1px solid rgba(244, 63, 94, 0.4)'
                    : '1px solid rgba(212, 175, 55, 0.4)',
                boxShadow:
                  t.type === 'success'
                    ? '0 10px 30px rgba(16, 185, 129, 0.15)'
                    : t.type === 'error'
                    ? '0 10px 30px rgba(244, 63, 94, 0.15)'
                    : '0 10px 30px rgba(212, 175, 55, 0.15)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {t.type === 'success' && <CheckCircle2 size={20} color="#10B981" />}
                {t.type === 'error' && <AlertCircle size={20} color="#F43F5E" />}
                {t.type === 'info' && <Info size={20} color="#D4AF37" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: '#F8FAFC',
                    marginBottom: t.message ? '2px' : '0',
                  }}
                >
                  {t.title}
                </h4>
                {t.message && (
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: '#94A3B8',
                      lineHeight: 1.4,
                    }}
                  >
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
