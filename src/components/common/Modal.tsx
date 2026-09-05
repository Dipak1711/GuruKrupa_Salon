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
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        const savedScrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, savedScrollY);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const getMaxWidthValue = () => {
    switch (maxWidth) {
      case 'sm':
        return '420px';
      case 'md':
        return '520px';
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
            padding: '16px 12px',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(23, 23, 23, 0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 1100,
            }}
          />

          {/* Modal Shell Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="salon-modal-container"
            style={{
              position: 'relative',
              width: 'calc(100% - 24px)',
              maxWidth: getMaxWidthValue(),
              maxHeight: 'calc(100dvh - 32px)',
              background: '#FFFFFF',
              border: '1px solid #E4DED4',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(23, 23, 23, 0.16)',
              zIndex: 1105,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Fixed Header */}
            {(title || showCloseButton) && (
              <div
                className="salon-modal-header"
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #E4DED4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexShrink: 0,
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  {typeof title === 'string' ? (
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#171717',
                        lineHeight: 1.2,
                        margin: 0,
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
                        fontSize: '0.8rem',
                        color: '#6F6A62',
                        marginTop: '2px',
                        marginBottom: 0,
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
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}
                    aria-label="Close dialog"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Body Content */}
            <div
              className="salon-modal-body"
              style={{
                padding: '20px',
                flex: 1,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
