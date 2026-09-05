import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'mobile' | 'sidebar';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const BeardedMaleIcon: React.FC<{ size?: number }> = ({ size = 38 }) => (
  <img
    src="/gurukrupa_head_icon.jpg"
    alt="GuruKrupa Gentleman Head Logo"
    style={{
      width: `${size}px`,
      height: 'auto',
      maxHeight: `${size * 1.15}px`,
      objectFit: 'contain',
      display: 'block',
      flexShrink: 0,
      mixBlendMode: 'multiply',
    }}
  />
);

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  onClick,
  className = '',
}) => {
  const iconSizeMap = {
    sm: 30,
    md: 38,
    lg: 48,
  };

  const currentIconSize = variant === 'mobile' ? 28 : iconSizeMap[size];

  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`salon-logo ${className}`}
        style={{ cursor: onClick ? 'pointer' : 'default', display: 'inline-flex', alignItems: 'center' }}
      >
        <BeardedMaleIcon size={currentIconSize} />
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div
        onClick={onClick}
        className={`salon-logo ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: onClick ? 'pointer' : 'default',
          textDecoration: 'none',
        }}
      >
        <BeardedMaleIcon size={28} />
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '0.72rem',
              color: '#C9A227',
              fontWeight: 500,
              marginBottom: '-2px',
              marginLeft: '2px',
            }}
          >
            Studio
          </span>
          <span
            className="font-serif"
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#171717',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            GURUKRUPA
          </span>
          <span
            style={{
              fontSize: '0.48rem',
              fontWeight: 700,
              color: '#171717',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              marginTop: '2px',
              opacity: 0.85,
            }}
          >
            BARBER STUDIO
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`salon-logo ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          cursor: onClick ? 'pointer' : 'default',
          textDecoration: 'none',
        }}
      >
        <BeardedMaleIcon size={currentIconSize} />
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontSize: size === 'lg' ? '0.9rem' : '0.78rem',
              color: '#C9A227',
              fontWeight: 500,
              marginBottom: '-2px',
              marginLeft: '2px',
            }}
          >
            Studio
          </span>
          <span
            className="font-serif"
            style={{
              fontSize: size === 'lg' ? '1.45rem' : size === 'sm' ? '1.05rem' : '1.25rem',
              fontWeight: 800,
              color: '#171717',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            GURUKRUPA
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '3px 0 2px 0', opacity: 0.85 }}>
            <div style={{ height: '1px', flex: 1, backgroundColor: '#C9A227' }} />
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
            <div style={{ height: '1px', flex: 1, backgroundColor: '#C9A227' }} />
          </div>
          <span
            style={{
              fontSize: size === 'lg' ? '0.58rem' : '0.52rem',
              fontWeight: 700,
              color: '#171717',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1,
            }}
          >
            BARBER STUDIO
          </span>
        </div>
      </div>
    );
  }

  // Full & Sidebar Variants
  return (
    <div
      onClick={onClick}
      className={`salon-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        cursor: onClick ? 'pointer' : 'default',
        textDecoration: 'none',
      }}
    >
      <BeardedMaleIcon size={currentIconSize} />
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1 }}>
        {/* Top Gold Cursive: Studio */}
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: size === 'lg' ? '1rem' : size === 'sm' ? '0.78rem' : '0.88rem',
            color: '#C9A227',
            fontWeight: 500,
            marginBottom: '-3px',
            marginLeft: '2px',
          }}
        >
          Studio
        </span>

        {/* Top Wordmark: GURUKRUPA */}
        <span
          className="font-serif"
          style={{
            fontSize: size === 'lg' ? '1.6rem' : size === 'sm' ? '1.15rem' : '1.38rem',
            fontWeight: 800,
            color: '#171717',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          GURUKRUPA
        </span>

        {/* Gold Scissors Line Accent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 3px 0', width: '100%' }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#C9A227', opacity: 0.85 }} />
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#C9A227', opacity: 0.85 }} />
        </div>

        {/* Subtext: BARBER STUDIO */}
        <span
          style={{
            fontSize: size === 'lg' ? '0.62rem' : size === 'sm' ? '0.48rem' : '0.56rem',
            fontWeight: 700,
            color: '#171717',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
            lineHeight: 1,
          }}
        >
          BARBER STUDIO
        </span>
      </div>
    </div>
  );
};
