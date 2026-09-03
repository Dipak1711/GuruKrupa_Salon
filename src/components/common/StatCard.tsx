import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendPositive = true,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="glass-card"
      style={{
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4DED4',
        borderRadius: '18px',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
      }}
    >
      {/* Glow decorative corner */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(201, 162, 39, 0.06)',
          filter: 'blur(16px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#6F6A62', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#F1EDE6',
            border: '1px solid #E4DED4',
            color: '#C9A227',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <h3
          style={{
            fontSize: '1.9rem',
            fontWeight: 700,
            color: '#171717',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </h3>

        {(subtitle || trend) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            {trend && (
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: trendPositive ? '#16845B' : '#C94A4A',
                  backgroundColor: trendPositive ? 'rgba(22, 132, 91, 0.12)' : 'rgba(201, 74, 74, 0.12)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                }}
              >
                {trend}
              </span>
            )}
            {subtitle && (
              <span style={{ fontSize: '0.8rem', color: '#8C857B' }}>{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
