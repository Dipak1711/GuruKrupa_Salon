import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SalonDataProvider, useSalonData } from './context/SalonDataContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Customer Components
import { CustomerHome } from './components/customer/CustomerHome';
import { CustomerBookingView } from './components/customer/CustomerBookingView';
import { OffersView } from './components/customer/OffersView';
import { GalleryView } from './components/customer/GalleryView';
import { CustomerProfile } from './components/customer/CustomerProfile';

// Employee Components
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { CompleteServiceModal } from './components/employee/CompleteServiceModal';
import { EmployeeEarnings } from './components/employee/EmployeeEarnings';
import { EmployeeClients } from './components/employee/EmployeeClients';
import { EmployeeProfile } from './components/employee/EmployeeProfile';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ServiceManager } from './components/admin/ServiceManager';
import { EmployeeManager } from './components/admin/EmployeeManager';
import { LeaveManager } from './components/admin/LeaveManager';
import { RevenueReports } from './components/admin/RevenueReports';
import { CustomerManager } from './components/admin/CustomerManager';
import { OfferManager } from './components/admin/OfferManager';
import { GalleryManager } from './components/admin/GalleryManager';
import { ReviewManager } from './components/admin/ReviewManager';
import { CategoryManager } from './components/admin/CategoryManager';
import { SettingsView } from './components/admin/SettingsView';

import { MobileBottomNav } from './components/common/MobileBottomNav';
import { BranchBottomSheet } from './components/common/BranchBottomSheet';

import { Scissors, Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

const SalonApp: React.FC = () => {
  const { currentRole, activeEmployeeId } = useAuth();

  // Navigation & Drawer State
  const [activeView, setActiveView] = useState<string>('home');
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isBranchSheetOpen, setIsBranchSheetOpen] = useState(false);

  // Sync default view whenever role changes
  useEffect(() => {
    if (currentRole === 'customer') {
      setActiveView('home');
    } else if (currentRole === 'employee') {
      setActiveView('dashboard');
    } else if (currentRole === 'admin') {
      setActiveView('dashboard');
    }
  }, [currentRole]);

  // Handle employee "Add Service" sidebar click
  const handleViewChange = (view: string) => {
    if (view === 'add-service') {
      setIsWalkInModalOpen(true);
      return;
    }
    setActiveView(view);
  };

  const renderActiveContent = () => {
    // ----------------------------------------------------
    // CUSTOMER VIEWS
    // ----------------------------------------------------
    if (currentRole === 'customer') {
      switch (activeView) {
        case 'home':
          return <CustomerHome onNavigateToView={setActiveView} />;
        case 'booking':
        case 'book':
          return <CustomerBookingView />;
        case 'offers':
          return <OffersView onNavigateToBooking={() => setActiveView('booking')} />;
        case 'gallery':
          return <GalleryView />;
        case 'profile':
          return <CustomerProfile />;
        default:
          return <CustomerHome onNavigateToView={setActiveView} />;
      }
    }

    // ----------------------------------------------------
    // EMPLOYEE / STYLIST VIEWS
    // ----------------------------------------------------
    if (currentRole === 'employee') {
      switch (activeView) {
        case 'dashboard':
          return <EmployeeDashboard onNavigateToView={setActiveView} />;
        case 'my-clients':
          return <EmployeeClients />;
        case 'my-earnings':
        case 'service-history':
          return <EmployeeEarnings />;
        case 'profile':
          return <EmployeeProfile />;
        default:
          return <EmployeeDashboard onNavigateToView={setActiveView} />;
      }
    }

    // ----------------------------------------------------
    // ADMIN VIEWS
    // ----------------------------------------------------
    if (currentRole === 'admin') {
      switch (activeView) {
        case 'dashboard':
          return <AdminDashboard onNavigateToView={setActiveView} />;
        case 'customers':
          return <CustomerManager />;
        case 'employees':
          return <EmployeeManager onOpenLeaveManager={() => setActiveView('leave-manager')} />;
        case 'leave-manager':
          return <LeaveManager />;
        case 'services':
          return <ServiceManager />;
        case 'categories':
          return <CategoryManager />;
        case 'revenue':
        case 'reports':
          return <RevenueReports />;
        case 'offers':
          return <OfferManager />;
        case 'gallery':
          return <GalleryManager />;
        case 'reviews':
          return <ReviewManager />;
        case 'settings':
          return <SettingsView />;
        default:
          return <AdminDashboard onNavigateToView={setActiveView} />;
      }
    }

    return null;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F4EF' }}>
      {/* Sticky Luxury Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenBranchSheet={() => setIsBranchSheetOpen(true)}
      />

      {/* Main Layout Container */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', paddingTop: '70px' }}>
        {/* Role-Specific Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={handleViewChange}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Desktop Spacer to preserve layout width for fixed sidebar */}
        <div className="desktop-sidebar-spacer" />

        {/* Dynamic Content Viewport */}
        <main
          style={{
            flex: 1,
            padding: '32px 32px 64px 32px',
            maxWidth: '1360px',
            margin: '0 auto',
            width: '100%',
            overflowX: 'hidden',
          }}
        >
          {renderActiveContent()}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (< 768px) */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={handleViewChange}
        onOpenMobileDrawer={() => setIsMobileSidebarOpen(true)}
      />

      {/* Mobile Native Branch Selection Bottom Sheet */}
      <BranchBottomSheet
        isOpen={isBranchSheetOpen}
        onClose={() => setIsBranchSheetOpen(false)}
      />

      {/* Walk-in Service Fulfillment Modal for Stylists */}
      <CompleteServiceModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        appointment={null}
        employeeId={activeEmployeeId}
        onCompleted={() => {
          setIsWalkInModalOpen(false);
          setActiveView('dashboard');
        }}
      />

      {/* Luxury Salon Footer */}
      <footer
        style={{
          borderTop: '1px solid #E4DED4',
          backgroundColor: '#FFFFFF',
          padding: '40px 32px 24px 32px',
          color: '#6F6A62',
          fontSize: '0.86rem',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            marginBottom: '32px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: '#C9A227',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Scissors size={16} color="#FFFFFF" />
              </div>
              <span className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 700 }}>
                GuruKrupa SALON
              </span>
            </div>
            <p style={{ lineHeight: 1.5, color: '#6F6A62', fontSize: '0.82rem' }}>
              Premier luxury grooming, precision scissor craft, signature beard architecture, and restorative skin rejuvenation.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#171717', fontWeight: 600, marginBottom: '10px', fontSize: '0.9rem' }}>VIP Hotline</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <a
                href="tel:+919823012345"
                style={{ color: '#9A7B1C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
              >
                <Phone size={14} color="#C9A227" />
                <span>+91 98230 12345 (Direct Call)</span>
              </a>
              <span style={{ fontSize: '0.8rem', color: '#8C857B' }}>
                Instant phone consultation available with master stylists
              </span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#171717', fontWeight: 600, marginBottom: '10px', fontSize: '0.9rem' }}>Operating Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#171717' }}>
                <Clock size={14} color="#C9A227" />
                <span>Mon – Sun: 09:00 AM – 09:30 PM</span>
              </div>
              <span style={{ color: '#16845B', fontSize: '0.78rem', fontWeight: 600 }}>Open 7 Days • Valet Parking Available</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#171717', fontWeight: 600, marginBottom: '10px', fontSize: '0.9rem' }}>Studio Location</h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.82rem', color: '#171717' }}>
              <MapPin size={15} color="#C9A227" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>Linking Road, Bandra West, Mumbai, Maharashtra 400050</span>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            borderTop: '1px solid #E4DED4',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#8C857B',
          }}
        >
          <span>© {new Date().getFullYear()} GuruKrupa SALON. All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted for luxury salon operations</span>
            <ShieldCheck size={14} color="#C9A227" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SalonDataProvider>
          <SalonApp />
        </SalonDataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
