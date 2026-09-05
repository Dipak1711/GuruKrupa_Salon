import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { Shield, User, Menu, Building2, UserCheck, Scissors, X } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenBranchSheet?: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenBranchSheet, setActiveView }) => {
  const { currentRole, currentUser, setRole } = useAuth();
  const { branches } = useSalonData();
  const [isPanelSelectorOpen, setIsPanelSelectorOpen] = useState(false);

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

        {/* Center: GuruKrupa MEN'S SALON Logo */}
        <Logo variant="mobile" onClick={() => setActiveView('home')} />

        {/* Right Section: Branch Icon + Panel Icon + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

          {/* Mobile Panel / Role Selector Icon */}
          <button
            onClick={() => setIsPanelSelectorOpen(!isPanelSelectorOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isPanelSelectorOpen ? '#C9A227' : '#F1EDE6',
              border: `1px solid ${isPanelSelectorOpen ? '#C9A227' : '#E4DED4'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isPanelSelectorOpen ? '#FFFFFF' : '#C9A227',
              transition: 'all 0.2s ease',
            }}
            title="Select Panel"
            aria-label="Select Panel"
          >
            {currentRole === 'admin' ? (
              <Shield size={16} color={isPanelSelectorOpen ? '#FFFFFF' : '#C9A227'} />
            ) : currentRole === 'employee' ? (
              <Scissors size={16} color={isPanelSelectorOpen ? '#FFFFFF' : '#C9A227'} />
            ) : (
              <User size={16} color={isPanelSelectorOpen ? '#FFFFFF' : '#C9A227'} />
            )}
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

      {/* Mobile Compact Panel Selector Popover Modal */}
      {isPanelSelectorOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsPanelSelectorOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1001,
              backgroundColor: 'rgba(23, 23, 23, 0.3)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          />

          {/* Popover Dropdown Card */}
          <div
            style={{
              position: 'fixed',
              top: '76px',
              right: '16px',
              width: '230px',
              zIndex: 1002,
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E4DED4',
              boxShadow: '0 12px 30px rgba(23, 23, 23, 0.15)',
              padding: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #F1EDE6',
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#171717',
                  letterSpacing: '0.02em',
                }}
              >
                Select Panel
              </span>
              <button
                onClick={() => setIsPanelSelectorOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6F6A62',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                }}
                aria-label="Close Panel Selector"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Customer Option */}
              <button
                onClick={() => {
                  setRole('customer');
                  setIsPanelSelectorOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: currentRole === 'customer' ? '1px solid #C9A227' : '1px solid transparent',
                  backgroundColor: currentRole === 'customer' ? '#C9A227' : '#F7F4EF',
                  color: '#171717',
                  fontWeight: currentRole === 'customer' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <User size={18} color={currentRole === 'customer' ? '#171717' : '#C9A227'} />
                <span>Customer</span>
              </button>

              {/* Stylist Option */}
              <button
                onClick={() => {
                  setRole('employee');
                  setIsPanelSelectorOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: currentRole === 'employee' ? '1px solid #C9A227' : '1px solid transparent',
                  backgroundColor: currentRole === 'employee' ? '#C9A227' : '#F7F4EF',
                  color: '#171717',
                  fontWeight: currentRole === 'employee' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <Scissors size={18} color={currentRole === 'employee' ? '#171717' : '#C9A227'} />
                <span>Stylist</span>
              </button>

              {/* Admin Option */}
              <button
                onClick={() => {
                  setRole('admin');
                  setIsPanelSelectorOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: currentRole === 'admin' ? '1px solid #C9A227' : '1px solid transparent',
                  backgroundColor: currentRole === 'admin' ? '#C9A227' : '#F7F4EF',
                  color: '#171717',
                  fontWeight: currentRole === 'admin' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <Shield size={18} color={currentRole === 'admin' ? '#171717' : '#C9A227'} />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* --------------------------------------------------------- */}
      {/* DESKTOP-ONLY HEADER (>= 768px)                             */}
      {/* --------------------------------------------------------- */}
      <div className="desktop-only-header" style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Section: Brand Logo */}
        <Logo variant="compact" size="md" onClick={() => setActiveView('home')} />

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
              <Scissors size={13} />
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
