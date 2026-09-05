import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { Shield, User, Menu, Building2, UserCheck } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenBranchSheet?: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenBranchSheet, setActiveView }) => {
  const { currentRole, currentUser, setRole } = useAuth();
  const { branches } = useSalonData();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E4DED4',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
      }}
    >
      {/* --------------------------------------------------------- */}
      {/* MOBILE-ONLY COMPACT HEADER (< 768px)                       */}
      {/* --------------------------------------------------------- */}
      <div className="mobile-only-header" style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Hamburger Menu Icon */}
        <button
          onClick={onToggleSidebar}
          style={{
            padding: '6px',
            borderRadius: '8px',
            minHeight: '36px',
            minWidth: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4DED4',
            color: '#C9A227',
            cursor: 'pointer',
          }}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} color="#C9A227" />
        </button>

        {/* Center: GuruKrupa SALON Brand */}
        <div
          onClick={() => setActiveView('home')}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '4px',
            cursor: 'pointer',
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#171717',
              letterSpacing: '-0.01em',
            }}
          >
            GuruKrupa
          </span>
          <span
            style={{
              color: '#C9A227',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              fontFamily: 'var(--font-sans)',
              textTransform: 'uppercase',
            }}
          >
            SALON
          </span>
        </div>

        {/* Right Section: Branch Icon + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mobile Tappable Branch Icon Only */}
          <button
            onClick={onOpenBranchSheet}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1EDE6',
              border: '1px solid #E4DED4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#C9A227',
            }}
            title="Select Branch"
            aria-label="Select Branch"
          >
            <Building2 size={16} color="#C9A227" />
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => setActiveView('profile')}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5px solid #C9A227',
              cursor: 'pointer',
            }}
          >
            <img
              src={currentUser.avatar_url}
              alt={currentUser.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* DESKTOP-ONLY HEADER (>= 768px)                             */}
      {/* --------------------------------------------------------- */}
      <div className="desktop-only-header" style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Section: Pure Brand Title (No Hamburger, No Scissors) */}
        <div
          onClick={() => setActiveView('home')}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
              color: '#171717',
              lineHeight: 1,
            }}
          >
            GuruKrupa
          </span>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#C9A227',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
            }}
          >
            SALON
          </span>
        </div>

        {/* Right Section: Branch Icon + Role Controls + User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Desktop Tappable Branch Icon Only (No permanent branch name text) */}
          {branches.length > 0 && (
            <button
              onClick={onOpenBranchSheet}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#F1EDE6',
                border: '1px solid #E4DED4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#C9A227',
                transition: 'all 0.2s ease',
              }}
              title="Select Branch Studio"
              aria-label="Select Branch Studio"
            >
              <Building2 size={17} color="#C9A227" />
            </button>
          )}

          {/* Role Switcher Pill (Customer / Stylist / Admin) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F7F4EF',
              padding: '3px',
              borderRadius: '12px',
              border: '1px solid #E4DED4',
            }}
          >
            <button
              onClick={() => setRole('customer')}
              style={{
                padding: '6px 14px',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: currentRole === 'customer' ? '#C9A227' : 'transparent',
                color: currentRole === 'customer' ? '#171717' : '#6F6A62',
                transition: 'all 0.2s ease',
              }}
            >
              <User size={13} />
              <span>Customer</span>
            </button>

            <button
              onClick={() => setRole('employee')}
              style={{
                padding: '6px 14px',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: currentRole === 'employee' ? '#C9A227' : 'transparent',
                color: currentRole === 'employee' ? '#171717' : '#6F6A62',
                transition: 'all 0.2s ease',
              }}
            >
              <UserCheck size={13} />
              <span>Stylist</span>
            </button>

            <button
              onClick={() => setRole('admin')}
              style={{
                padding: '6px 14px',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: currentRole === 'admin' ? '#C9A227' : 'transparent',
                color: currentRole === 'admin' ? '#171717' : '#6F6A62',
                transition: 'all 0.2s ease',
              }}
            >
              <Shield size={13} />
              <span>Admin</span>
            </button>
          </div>

          {/* User Profile Control */}
          <div
            onClick={() => setActiveView('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px 4px 4px',
              borderRadius: '999px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4DED4',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <img
              src={currentUser.avatar_url}
              alt={currentUser.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #C9A227',
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#171717', display: 'block' }}>
                {currentUser.name.split(' ')[0]}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#9A7B1C', textTransform: 'capitalize', fontWeight: 600 }}>
                {currentRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
