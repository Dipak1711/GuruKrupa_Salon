import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'mobile' | 'sidebar';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const BeardedMaleIcon: React.FC<{ size?: number; color?: string; ringColor?: string }> = ({
  size = 38,
  color = '#171717',
  ringColor = '#C9A227',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', flexShrink: 0 }}
    aria-hidden="true"
  >
    {/* Outer Double Gold Ring Emblem */}
    <circle cx="50" cy="50" r="47" stroke={ringColor} strokeWidth="2.5" fill="none" />
    <circle cx="50" cy="50" r="43" stroke={ringColor} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.65" />

    {/* Background Surface */}
    <circle cx="50" cy="50" r="41" fill="#F7F4EF" />

    {/* Bearded Gentleman Side Profile Silhouette */}
    <g fill={color}>
      {/* Sleek Modern Hair Pompadour Sweep (Side Profile) */}
      <path d="M26 42 C24 30 32 18 46 17 C60 16 72 23 76 34 C78 40 75 46 71 48 C66 50 61 45 56 44 C48 42 40 43 33 47 C30 49 27 46 26 42 Z" />
      <path d="M42 18 C50 16 62 18 70 24 C74 27 77 34 74 40 C69 33 59 26 47 26 C40 26 34 28 30 32 C33 24 37 20 42 18 Z" opacity="0.8" />

      {/* Sunglasses Profile Lens */}
      <path d="M38 46 H54 V53 C54 57 51 59 47 59 H43 C39 59 37 57 37 53 V48 C37 47 37.5 46 38 46 Z" />
      <path d="M57 46 H66 C68 46 69 47.5 69 49 V53 C69 57 66 59 62 59 H60 C58 59 57 57 57 53 V46 Z" opacity="0.95" />
      <rect x="53" y="47" width="5" height="2" rx="1" fill={color} />
      <line x1="41" y1="48" x2="47" y2="56" stroke={ringColor} strokeWidth="1.5" opacity="0.85" />

      {/* Nose Side Profile */}
      <path d="M52 47 L48 58 L54 58 Z" opacity="0.9" />

      {/* Full Groomed Beard & Mustache Side Profile */}
      <path d="M44 60 C47 59 52 61 52 61 C52 61 56 59 59 60 C63 61 66 64 63 66 C59 68 53 64 52 64 C51 64 45 68 41 66 C38 64 41 61 44 60 Z" />
      <path d="M30 48 C28 55 30 64 34 70 C39 77 46 83 53 84 C60 83 67 76 70 68 C73 62 74 54 72 48 C69 52 66 60 63 65 C58 74 52 78 48 78 C44 78 38 74 34 65 C32 59 31 52 30 48 Z" />

      {/* Neck / Collar Line */}
      <path d="M42 83 L40 90 H60 L58 83 C54 85 51 86 48 86 C45 86 42 85 42 83 Z" opacity="0.75" />
    </g>
  </svg>
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span
              className="font-serif"
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#171717',
                letterSpacing: '0.02em',
              }}
            >
              GURUKRUPA
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '0.72rem',
                color: '#C9A227',
              }}
            >
              Studio
            </span>
          </div>
          <span
            style={{
              fontSize: '0.56rem',
              fontWeight: 700,
              color: '#C9A227',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
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
          gap: '8px',
          cursor: onClick ? 'pointer' : 'default',
          textDecoration: 'none',
        }}
      >
        <BeardedMaleIcon size={currentIconSize} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span
            className="font-serif"
            style={{
              fontSize: size === 'lg' ? '1.4rem' : size === 'sm' ? '1.05rem' : '1.25rem',
              fontWeight: 700,
              color: '#171717',
              letterSpacing: '0.03em',
              lineHeight: 1,
            }}
          >
            GURUKRUPA
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '0.8rem',
              color: '#C9A227',
            }}
          >
            Studio
          </span>
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span
              className="font-serif"
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#171717',
                letterSpacing: '0.03em',
              }}
            >
              GURUKRUPA
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '0.76rem',
                color: '#C9A227',
              }}
            >
              Studio
            </span>
          </div>
          <span
            style={{
              fontSize: '0.58rem',
              fontWeight: 700,
              color: '#C9A227',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
              marginTop: '2px',
            }}
          >
            BARBER STUDIO
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
        {/* Top Wordmark: GURUKRUPA + Studio */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', lineHeight: 1 }}>
          <span
            className="font-serif"
            style={{
              fontSize: size === 'lg' ? '1.5rem' : size === 'sm' ? '1.15rem' : '1.35rem',
              fontWeight: 700,
              color: '#171717',
              letterSpacing: '0.04em',
            }}
          >
            GURUKRUPA
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: size === 'lg' ? '0.95rem' : size === 'sm' ? '0.75rem' : '0.86rem',
              fontWeight: 500,
              color: '#C9A227',
            }}
          >
            Studio
          </span>
        </div>

        {/* Minimal Gold Scissors Accent Line: ── ✂ ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '3px 0 2px 0', opacity: 0.85 }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#C9A227' }} />
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#C9A227' }} />
        </div>

        {/* Subtext: BARBER STUDIO */}
        <span
          style={{
            fontSize: size === 'lg' ? '0.68rem' : size === 'sm' ? '0.54rem' : '0.62rem',
            fontWeight: 700,
            color: '#C9A227',
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
};
