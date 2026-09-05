import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'mobile' | 'sidebar';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const BeardedMaleIcon: React.FC<{ size?: number; color?: string; ringColor?: string }> = ({
  size = 38,
}) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      overflow: 'hidden',
      border: '1.5px solid #C9A227',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      flexShrink: 0,
      boxShadow: '0 2px 6px rgba(23, 23, 23, 0.08)',
    }}
  >
    <img
      src="/gurukrupa_logo_icon.jpg"
      alt="GuruKrupa Gentleman Logo"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </div>
);

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  onClick,
  className = '',
}) => {
  const iconSizeMap = {
    sm: 28,
    md: 36,
    lg: 44,
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
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span
            className="font-serif"
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#171717',
              letterSpacing: '0.04em',
            }}
          >
            GURUKRUPA
          </span>
          <span
            style={{
              fontSize: '0.54rem',
              fontWeight: 700,
              color: '#C9A227',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
            }}
          >
            MEN'S SALON
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
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span
            className="font-serif"
            style={{
              fontSize: size === 'lg' ? '1.4rem' : size === 'sm' ? '1.05rem' : '1.25rem',
              fontWeight: 800,
              color: '#171717',
              letterSpacing: '0.04em',
            }}
          >
            GURUKRUPA
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ height: '1px', width: '10px', backgroundColor: '#C9A227' }} />
            <span
              style={{
                fontSize: size === 'lg' ? '0.64rem' : '0.56rem',
                fontWeight: 700,
                color: '#C9A227',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
              }}
            >
              MEN'S SALON
            </span>
            <div style={{ height: '1px', width: '10px', backgroundColor: '#C9A227' }} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
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
        <BeardedMaleIcon size={32} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span
            className="font-serif"
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#171717',
              letterSpacing: '0.04em',
            }}
          >
            GURUKRUPA
          </span>
          <span
            style={{
              fontSize: '0.56rem',
              fontWeight: 700,
              color: '#C9A227',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              marginTop: '1px',
            }}
          >
            MEN'S SALON
          </span>
        </div>
      </div>
    );
  }

  // Full Variant (Default)
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
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        {/* Top Wordmark: GURUKRUPA */}
        <span
          className="font-serif"
          style={{
            fontSize: size === 'lg' ? '1.5rem' : size === 'sm' ? '1.15rem' : '1.35rem',
            fontWeight: 800,
            color: '#171717',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          GURUKRUPA
        </span>

        {/* Gold Accent Line: ── MEN'S SALON ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '3px 0 2px 0', opacity: 0.9 }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#C9A227' }} />
          <span
            style={{
              fontSize: size === 'lg' ? '0.68rem' : size === 'sm' ? '0.54rem' : '0.62rem',
              fontWeight: 700,
              color: '#C9A227',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1,
            }}
          >
            MEN'S SALON
          </span>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#C9A227' }} />
        </div>
      </div>
    </div>
  );
};
