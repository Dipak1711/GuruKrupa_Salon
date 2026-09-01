import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Tag,
  CalendarCheck,
  Image,
  User,
  LayoutDashboard,
  Calendar,
  PlusCircle,
  DollarSign,
  Users,
  Layers,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenMobileDrawer?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  setActiveView,
  onOpenMobileDrawer,
}) => {
  const { currentRole } = useAuth();

  const handleNav = (viewKey: string) => {
    setActiveView(viewKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="mobile-bottom-nav-container"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 95,
        backgroundColor: 'rgba(12, 14, 20, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        padding: '6px 8px calc(6px + env(safe-area-inset-bottom, 0px)) 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.7)',
      }}
    >
      {/* 1. CUSTOMER MOBILE BOTTOM NAV */}
      {currentRole === 'customer' && (
        <>
          <NavItem
            icon={<Home size={20} />}
            label="Home"
            active={activeView === 'home'}
            onClick={() => handleNav('home')}
          />
          <NavItem
            icon={<CalendarCheck size={20} />}
            label="Booking"
            active={activeView === 'booking'}
            onClick={() => handleNav('booking')}
            isSpecial
          />
          <NavItem
            icon={<Tag size={20} />}
            label="Offers"
            active={activeView === 'offers'}
            onClick={() => handleNav('offers')}
            hasBadge
          />
          <NavItem
            icon={<Image size={20} />}
            label="Gallery"
            active={activeView === 'gallery'}
            onClick={() => handleNav('gallery')}
          />
          <NavItem
            icon={<User size={20} />}
            label="Profile"
            active={activeView === 'profile'}
            onClick={() => handleNav('profile')}
          />
        </>
      )}

      {/* 2. EMPLOYEE MOBILE BOTTOM NAV */}
      {currentRole === 'employee' && (
        <>
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeView === 'dashboard'}
            onClick={() => handleNav('dashboard')}
          />
          <NavItem
            icon={<PlusCircle size={20} />}
            label="Walk-in"
            active={activeView === 'add-service'}
            onClick={() => handleNav('add-service')}
            isSpecial
          />
          <NavItem
            icon={<Users size={20} />}
            label="Clients"
            active={activeView === 'my-clients'}
            onClick={() => handleNav('my-clients')}
          />
          <NavItem
            icon={<DollarSign size={20} />}
            label="Earnings"
            active={activeView === 'my-earnings'}
            onClick={() => handleNav('my-earnings')}
          />
          <NavItem
            icon={<User size={20} />}
            label="Profile"
            active={activeView === 'profile'}
            onClick={() => handleNav('profile')}
          />
        </>
      )}

      {/* 3. ADMIN MOBILE BOTTOM NAV */}
      {currentRole === 'admin' && (
        <>
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeView === 'dashboard'}
            onClick={() => handleNav('dashboard')}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Employees"
            active={activeView === 'employees'}
            onClick={() => handleNav('employees')}
          />
          <NavItem
            icon={<DollarSign size={20} />}
            label="Revenue"
            active={activeView === 'revenue'}
            onClick={() => handleNav('revenue')}
          />
          <NavItem
            icon={<Layers size={20} />}
            label="More"
            active={false}
            onClick={onOpenMobileDrawer}
          />
        </>
      )}
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
  hasBadge?: boolean;
  isSpecial?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active,
  onClick,
  hasBadge,
  isSpecial,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 0',
        minHeight: '48px',
        backgroundColor: 'transparent',
        border: 'none',
        color: active ? '#D4AF37' : '#94A3B8',
        cursor: 'pointer',
        position: 'relative',
        transition: 'color 0.2s ease',
      }}
    >
      {isSpecial ? (
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#D4AF37',
            color: '#0A0C10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2px',
            boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
          }}
        >
          {icon}
        </div>
      ) : (
        <div style={{ position: 'relative', marginBottom: '3px' }}>
          {icon}
          {hasBadge && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-5px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#D4AF37',
              }}
            />
          )}
        </div>
      )}

      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: active ? 700 : 500,
          color: active ? '#F3E5AB' : isSpecial ? '#D4AF37' : '#94A3B8',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>
    </button>
  );
};
