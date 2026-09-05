import React, { useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const getMaxWidthValue = () => {
    switch (maxWidth) {
      case 'sm':
        return '420px';
      case 'md':
        return '540px';
      case 'lg':
        return '680px';
      case 'xl':
        return '820px';
      case '2xl':
        return '980px';
      case '4xl':
        return '1140px';
      default:
        return '680px';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="salon-modal-overlay-wrapper"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(23, 23, 23, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 1100,
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="salon-modal-container"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: getMaxWidthValue(),
              maxHeight: '88vh',
              overflowY: 'auto',
              background: '#FFFFFF',
              border: '1px solid #E4DED4',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(23, 23, 23, 0.12)',
              zIndex: 1105,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div
                className="salon-modal-header"
                style={{
                  padding: '22px 24px 16px 24px',
                  borderBottom: '1px solid #E4DED4',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  {typeof title === 'string' ? (
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 600,
                        color: '#171717',
                      }}
                    >
                      {title}
                    </h3>
                  ) : (
                    title
                  )}
                  {subtitle && (
                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: '#6F6A62',
                        marginTop: '4px',
                      }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    onClick={onClose}
                    style={{
                      background: '#F1EDE6',
                      border: '1px solid #E4DED4',
                      color: '#6F6A62',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#171717';
                      e.currentTarget.style.borderColor = '#C9A227';
                      e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6F6A62';
                      e.currentTarget.style.borderColor = '#E4DED4';
                      e.currentTarget.style.backgroundColor = '#F1EDE6';
                    }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="salon-modal-body" style={{ padding: '22px 24px', flex: 1 }}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
