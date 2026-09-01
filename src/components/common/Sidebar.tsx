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

  // Calculate pending appointments badge count
  const customerPendingCount = appointments.filter((a) => a.status === 'pending').length;
  const employeePendingCount = appointments.filter(
    (a) => a.employee_id === activeEmployeeId && a.status === 'pending'
  ).length;
  const adminPendingCount = appointments.filter((a) => a.status === 'pending').length;

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
          <div style={{ padding: '0 16px 8px 16px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Customer Experience
            </span>
          </div>

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
          <div style={{ padding: '0 16px 8px 16px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Stylist Portal
            </span>
          </div>

          {/* Stylist Selector */}
          <div style={{ padding: '0 12px 14px 12px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '12px',
                padding: '8px 10px',
              }}
            >
              <label style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                Active Stylist Account:
              </label>
              <select
                className="salon-select"
                value={activeEmployeeId}
                onChange={(e) => setActiveEmployeeId(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px', minHeight: '36px' }}
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
        <div style={{ padding: '0 16px 8px 16px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
          backgroundColor: '#0c0e14',
          borderRight: '1px solid rgba(212, 175, 55, 0.16)',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 70px)',
          position: 'sticky',
          top: '70px',
          overflowY: 'auto',
          padding: '20px 12px',
          zIndex: 95,
        }}
      >
        {/* Mobile Header Close Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px 14px 12px', marginBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scissors size={18} color="#D4AF37" />
            <span className="font-serif" style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: 600 }}>
              Menu
            </span>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {renderNavItems()}
        </div>

        {/* Logout button */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '16px',
            marginTop: '16px',
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
              border: '1px solid rgba(244, 63, 94, 0.2)',
              color: '#FB7185',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.12)';
              e.currentTarget.style.borderColor = '#F43F5E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.2)';
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
          ? 'rgba(212, 175, 55, 0.16)'
          : highlight
            ? 'rgba(212, 175, 55, 0.08)'
            : 'transparent',
        color: active
          ? '#F3E5AB'
          : highlight
            ? '#F6E29F'
            : '#CBD5E1',
        borderLeft: active ? '3px solid #D4AF37' : '3px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = '#FFFFFF';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = highlight
            ? 'rgba(212, 175, 55, 0.08)'
            : 'transparent';
          e.currentTarget.style.color = highlight ? '#F6E29F' : '#CBD5E1';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: active || highlight ? '#D4AF37' : '#94A3B8', display: 'flex' }}>
          {icon}
        </span>
        <span>{label}</span>
      </div>

      {badge && (
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
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
            color: '#000000',
            backgroundColor: '#F59E0B',
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
