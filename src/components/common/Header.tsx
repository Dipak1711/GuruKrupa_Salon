import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { Phone, Scissors, Shield, User, Volume2, RotateCcw, Menu } from 'lucide-react';
import { playLuxuryChime } from '../../utils/sound';
import { useToast } from '../../context/ToastContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, setActiveView }) => {
  const { currentRole, currentUser, setRole } = useAuth();
  const { resetToDemoData } = useSalonData();
  const { info } = useToast();

  const handleResetData = () => {
    if (window.confirm('Reset all salon data, appointments, and financial records to default demo state?')) {
      resetToDemoData();
      info('Reset Complete', 'Salon demo state restored to default.');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(10, 12, 16, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
        padding: '0 16px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Brand & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggleSidebar}
          className="btn-dark"
          style={{
            padding: '8px',
            borderRadius: '10px',
            minHeight: '40px',
            minWidth: '40px',
          }}
          id="mobile-sidebar-toggle"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={22} color="#D4AF37" />
        </button>

        <div
          onClick={() => setActiveView('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #997D28 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(212, 175, 55, 0.35)',
              flexShrink: 0,
            }}
          >
            <Scissors size={20} color="#0D0F14" strokeWidth={2.4} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span
                className="font-serif"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                }}
              >
                GuruKrupa
              </span>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#D4AF37',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                SALON
              </span>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                color: '#94A3B8',
                letterSpacing: '0.02em',
                display: 'block',
              }}
            >
              Luxury Grooming Studio
            </span>
          </div>
        </div>
      </div>

      {/* Center / Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Salon Direct Hotline */}
        <a
          href="tel:+919823012345"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '9999px',
            color: '#F3E5AB',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            minHeight: '38px',
          }}
          title="Direct VIP Phone Desk"
        >
          <Phone size={14} color="#D4AF37" />
          <span className="header-hotline-text">VIP Desk: +91 98230 12345</span>
        </a>

        {/* Demo Data Reset Button */}
        <button
          onClick={handleResetData}
          title="Reset to initial seed data"
          className="header-reset-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94A3B8',
            padding: '7px 10px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            minHeight: '38px',
          }}
        >
          <RotateCcw size={14} />
          <span>Reset Demo</span>
        </button>

        {/* Sound Test / Play chime */}
        <button
          onClick={() => playLuxuryChime('success')}
          title="Play luxury audio chime"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94A3B8',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Volume2 size={16} />
        </button>

        {/* Role Pill Switcher */}
        <div
          className="header-role-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(15, 18, 24, 0.95)',
            padding: '3px',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
          }}
        >
          <button
            onClick={() => setRole('customer')}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: currentRole === 'customer' ? '#D4AF37' : 'transparent',
              color: currentRole === 'customer' ? '#0D0F14' : '#94A3B8',
            }}
          >
            <User size={12} />
            <span>Customer</span>
          </button>

          <button
            onClick={() => setRole('employee')}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: currentRole === 'employee' ? '#D4AF37' : 'transparent',
              color: currentRole === 'employee' ? '#0D0F14' : '#94A3B8',
            }}
          >
            <Scissors size={12} />
            <span>Stylist</span>
          </button>

          <button
            onClick={() => setRole('admin')}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: currentRole === 'admin' ? '#D4AF37' : 'transparent',
              color: currentRole === 'admin' ? '#0D0F14' : '#94A3B8',
            }}
          >
            <Shield size={12} />
            <span>Admin</span>
          </button>
        </div>

        {/* User avatar indicator */}
        <div
          className="header-user-avatar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '3px 8px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <img
            src={currentUser.avatar_url}
            alt={currentUser.name}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #D4AF37',
            }}
          />
          <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#F8FAFC', display: 'block' }}>
              {currentUser.name.split(' ')[0]}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#D4AF37', textTransform: 'capitalize' }}>
              {currentRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
