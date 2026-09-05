import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Tag,
  Calendar,
  CalendarCheck,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Users,
  DollarSign,
  History,
  Scissors,
  Layers,
  TrendingUp,
  BarChart3,
  Image,
  Star,
  Settings,
  Sparkles,
  UserCheck,
  Phone,
  X,
} from 'lucide-react';
import { useSalonData } from '../../context/SalonDataContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { currentRole, logout, activeEmployeeId, setActiveEmployeeId } = useAuth();
  const { employees, appointments } = useSalonData();

  const handleNavClick = (viewKey: string) => {
    setActiveView(viewKey);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderNavItems = () => {
    if (currentRole === 'customer') {
      return (
        <>


          <NavItem
            icon={<Home size={18} />}
            label="Home"
            active={activeView === 'home'}
            onClick={() => handleNavClick('home')}
          />
          <NavItem
            icon={<Phone size={18} />}
            label="Booking"
            active={activeView === 'booking'}
            onClick={() => handleNavClick('booking')}
            highlight
          />
          <NavItem
            icon={<Tag size={18} />}
            label="Offers"
            active={activeView === 'offers'}
            onClick={() => handleNavClick('offers')}
            badge="New"
          />

          <NavItem
            icon={<Image size={18} />}
            label="Gallery & Styles"
            active={activeView === 'gallery'}
            onClick={() => handleNavClick('gallery')}
          />
          <NavItem
            icon={<User size={18} />}
            label="Profile"
            active={activeView === 'profile'}
            onClick={() => handleNavClick('profile')}
          />
        </>
      );
    }

    if (currentRole === 'employee') {
      return (
        <>
          <div style={{ padding: '0 12px 8px 12px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6F6A62', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Stylist Portal
            </span>
          </div>

          {/* Stylist Selector */}
          <div style={{ padding: '0 8px 14px 8px' }}>
            <div
              style={{
                backgroundColor: '#F1EDE6',
                border: '1px solid #E4DED4',
                borderRadius: '12px',
                padding: '8px 10px',
              }}
            >
              <label style={{ fontSize: '0.72rem', color: '#6F6A62', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Active Stylist Account:
              </label>
              <select
                className="salon-select"
                value={activeEmployeeId}
                onChange={(e) => setActiveEmployeeId(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px', minHeight: '36px', backgroundColor: '#FFFFFF' }}
              >
                {employees
                  .filter((e) => e.is_active)
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role_title.split(' ')[0]})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={activeView === 'dashboard'}
            onClick={() => handleNavClick('dashboard')}
          />
          <NavItem
            icon={<PlusCircle size={18} />}
            label="Add Service / Walk-in"
            active={activeView === 'add-service'}
            onClick={() => handleNavClick('add-service')}
            highlight
          />
          <NavItem
            icon={<Users size={18} />}
            label="My Clients"
            active={activeView === 'my-clients'}
            onClick={() => handleNavClick('my-clients')}
          />
          <NavItem
            icon={<DollarSign size={18} />}
            label="My Earnings"
            active={activeView === 'my-earnings'}
            onClick={() => handleNavClick('my-earnings')}
          />
          <NavItem
            icon={<History size={18} />}
            label="Service History"
            active={activeView === 'service-history'}
            onClick={() => handleNavClick('service-history')}
          />
          <NavItem
            icon={<User size={18} />}
            label="Profile & Leave"
            active={activeView === 'profile'}
            onClick={() => handleNavClick('profile')}
          />
        </>
      );
    }

    // Admin Role Sidebar
    return (
      <>
        <div style={{ padding: '0 12px 8px 12px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6F6A62', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Admin Command Center
          </span>
        </div>

        <NavItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          active={activeView === 'dashboard'}
          onClick={() => handleNavClick('dashboard')}
        />
        <NavItem
          icon={<Users size={18} />}
          label="Customers"
          active={activeView === 'customers'}
          onClick={() => handleNavClick('customers')}
        />
        <NavItem
          icon={<UserCheck size={18} />}
          label="Employees & Leaves"
          active={activeView === 'employees'}
          onClick={() => handleNavClick('employees')}
        />
        <NavItem
          icon={<Scissors size={18} />}
          label="Services"
          active={activeView === 'services'}
          onClick={() => handleNavClick('services')}
        />
        <NavItem
          icon={<Layers size={18} />}
          label="Categories"
          active={activeView === 'categories'}
          onClick={() => handleNavClick('categories')}
        />
        <NavItem
          icon={<TrendingUp size={18} />}
          label="Revenue"
          active={activeView === 'revenue'}
          onClick={() => handleNavClick('revenue')}
        />
        <NavItem
          icon={<BarChart3 size={18} />}
          label="Reports"
          active={activeView === 'reports'}
          onClick={() => handleNavClick('reports')}
        />
        <NavItem
          icon={<Tag size={18} />}
          label="Offers"
          active={activeView === 'offers'}
          onClick={() => handleNavClick('offers')}
        />
        <NavItem
          icon={<Image size={18} />}
          label="Gallery"
          active={activeView === 'gallery'}
          onClick={() => handleNavClick('gallery')}
        />
        <NavItem
          icon={<Star size={18} />}
          label="Reviews"
          active={activeView === 'reviews'}
          onClick={() => handleNavClick('reviews')}
        />
        <NavItem
          icon={<Settings size={18} />}
          label="Settings"
          active={activeView === 'settings'}
          onClick={() => handleNavClick('settings')}
        />
      </>
    );
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpenMobile && (
        <div
          className="mobile-overlay"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`desktop-sidebar ${isOpenMobile ? 'desktop-sidebar-open' : 'desktop-sidebar-closed'
          }`}
        style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E4DED4',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 70px)',
          position: 'fixed',
          top: '70px',
          left: 0,
          overflow: 'hidden',
          zIndex: 95,
          boxShadow: '2px 0 12px rgba(23, 23, 23, 0.02)',
        }}
      >
        {/* Fixed Top Header ("Menu") */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 16px 12px 16px',
            borderBottom: '1px solid #E4DED4',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scissors size={18} color="#C9A227" />
            <span
              className="font-serif"
              style={{ fontSize: '1.1rem', color: '#171717', fontWeight: 600 }}
            >
              Menu
            </span>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6F6A62',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Dedicated Scrollable Navigation List */}
        <div
          className="sidebar-scrollable-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {renderNavItems()}
        </div>

        {/* Fixed Bottom Logout Area */}
        <div
          style={{
            borderTop: '1px solid #E4DED4',
            padding: '14px 16px 18px 16px',
            flexShrink: 0,
            backgroundColor: '#FFFFFF',
          }}
        >
          <button
            onClick={() => {
              logout();
              if (onCloseMobile) onCloseMobile();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 16px',
              minHeight: '44px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(201, 74, 74, 0.25)',
              color: '#C94A4A',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(201, 74, 74, 0.08)';
              e.currentTarget.style.borderColor = '#C94A4A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(201, 74, 74, 0.25)';
            }}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
  badgeCount?: number;
  highlight?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active,
  onClick,
  badge,
  badgeCount,
  highlight,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        minHeight: '44px',
        borderRadius: '12px',
        border: 'none',
        fontSize: '0.88rem',
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        backgroundColor: active
          ? 'rgba(201, 162, 39, 0.12)'
          : highlight
            ? 'rgba(201, 162, 39, 0.06)'
            : 'transparent',
        color: active
          ? '#171717'
          : highlight
            ? '#9A7B1C'
            : '#6F6A62',
        borderLeft: active ? '3px solid #C9A227' : '3px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = '#F1EDE6';
          e.currentTarget.style.color = '#171717';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = highlight
            ? 'rgba(201, 162, 39, 0.06)'
            : 'transparent';
          e.currentTarget.style.color = highlight ? '#9A7B1C' : '#6F6A62';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: active || highlight ? '#C9A227' : '#8C857B', display: 'flex' }}>
          {icon}
        </span>
        <span>{label}</span>
      </div>

      {badge && (
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#9A7B1C',
            backgroundColor: 'rgba(201, 162, 39, 0.15)',
            padding: '2px 7px',
            borderRadius: '9999px',
          }}
        >
          {badge}
        </span>
      )}

      {badgeCount !== undefined && badgeCount > 0 && (
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#FFFFFF',
            backgroundColor: '#B7791F',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {badgeCount}
        </span>
      )}
    </button>
  );
};
