import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(18, 22, 30, 0.4)',
        border: '1px dashed rgba(212, 175, 55, 0.25)',
        borderRadius: '20px',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          color: '#D4AF37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        {icon}
      </div>

      <h4
        className="font-serif"
        style={{ fontSize: '1.25rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '6px' }}
      >
        {title}
      </h4>

      <p
        style={{
          fontSize: '0.88rem',
          color: '#94A3B8',
          maxWidth: '420px',
          lineHeight: 1.5,
          marginBottom: action ? '20px' : '0',
        }}
      >
        {description}
      </p>

      {action && (
        <button onClick={action.onClick} className="btn-gold" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
          {action.label}
        </button>
      )}
    </motion.div>
  );
};
