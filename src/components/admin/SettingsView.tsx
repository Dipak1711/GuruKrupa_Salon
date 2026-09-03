import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useSalonData } from '../../context/SalonDataContext';
import {
  Settings,
  Phone,
  Clock,
  MapPin,
  Save,
  RotateCcw,
  Building2,
  Mail,
  Sliders,
  Bell,
  Palette,
  ShieldCheck,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { resetToDemoData } = useSalonData();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState<'info' | 'contact' | 'business' | 'service' | 'notifications' | 'appearance'>('info');

  // Salon Info State
  const [salonName, setSalonName] = useState('GuruKrupa SALON');
  const [tagline, setTagline] = useState('Bespoke Stylist & Grooming Studio');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=200&q=80');
  const [description, setDescription] = useState('Luxury men’s grooming sanctuary specializing in precision hair sculpting, traditional shaves, and skin treatments.');

  // Contact Info State
  const [hotline, setHotline] = useState('+919823012345');
  const [email, setEmail] = useState('concierge@gurukrupasalon.com');
  const [address, setAddress] = useState('Shop 4-5, Royal Grandeur Avenue, Linking Road, Bandra West, Mumbai, Maharashtra 400050');
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('09:30 PM');

  // Business Preferences State
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [bookingNotice, setBookingNotice] = useState('Direct stylist booking request. Salon desk will confirm availability upon arrival.');

  // Notification Preferences State
  const [notifyOnNewBooking, setNotifyOnNewBooking] = useState(true);
  const [notifyOnLeaveRequest, setNotifyOnLeaveRequest] = useState(true);

  // Appearance State
  const [themeMode, setThemeMode] = useState('Light Luxury Salon UI');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Updated', 'Salon configuration and branding information updated successfully.');
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo state to fresh default seed data?')) {
      resetToDemoData();
      info('Reset Complete', 'Database state re-seeded to defaults.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '980px', margin: '0 auto' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Configuration & Environment
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
          Admin Salon Settings
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
          Manage branding, contact information, operational preferences, and system notifications.
        </p>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          borderBottom: '1px solid #E4DED4',
        }}
      >
        {[
          { id: 'info', label: 'Salon Information', icon: <Building2 size={15} /> },
          { id: 'contact', label: 'Contact Details', icon: <Phone size={15} /> },
          { id: 'business', label: 'Business Preferences', icon: <Sliders size={15} /> },
          { id: 'service', label: 'Service Rules', icon: <Clock size={15} /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
          { id: 'appearance', label: 'Appearance', icon: <Palette size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px 10px 0 0',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'rgba(201, 162, 39, 0.16)' : 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid #C9A227' : '2px solid transparent',
              color: activeTab === tab.id ? '#9A7B1C' : '#6F6A62',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSave} className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4', borderRadius: '18px' }}>
        {/* TAB 1: Salon Information */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img
                src={logoUrl}
                alt="Salon Logo"
                style={{ width: '74px', height: '74px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #C9A227' }}
              />
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Logo URL</label>
                <input
                  type="url"
                  className="salon-input"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Salon Name *</label>
                <input type="text" className="salon-input" value={salonName} onChange={(e) => setSalonName(e.target.value)} required />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Tagline *</label>
                <input type="text" className="salon-input" value={tagline} onChange={(e) => setTagline(e.target.value)} required />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Salon Description & About</label>
              <textarea className="salon-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
          </div>
        )}

        {/* TAB 2: Contact Information */}
        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Phone Hotline (tel: link) *</label>
                <input type="tel" className="salon-input" value={hotline} onChange={(e) => setHotline(e.target.value)} required />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Contact Email *</label>
                <input type="email" className="salon-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Daily Opening Time *</label>
                <input type="text" className="salon-input" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} required />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Daily Closing Time *</label>
                <input type="text" className="salon-input" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} required />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Physical Address *</label>
              <textarea className="salon-input" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
          </div>
        )}

        {/* TAB 3: Business Preferences */}
        {activeTab === 'business' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Currency Symbol</label>
              <input type="text" className="salon-input" value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} required />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Booking Notice Policy Text</label>
              <textarea className="salon-input" rows={3} value={bookingNotice} onChange={(e) => setBookingNotice(e.target.value)} required />
            </div>
          </div>
        )}

        {/* TAB 4: Service Rules */}
        {activeTab === 'service' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F1EDE6', border: '1px solid #E4DED4' }}>
              <h4 style={{ color: '#171717', fontSize: '1rem', marginBottom: '4px', fontWeight: 600 }}>Direct Booking Rule (No Time-Slots)</h4>
              <p style={{ fontSize: '0.84rem', color: '#6F6A62', lineHeight: 1.45 }}>
                Customers book directly with their preferred master stylist. No artificial time-slot generation or calendar grid is forced.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: Notification Preferences */}
        {activeTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', color: '#171717', fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={notifyOnNewBooking}
                onChange={(e) => setNotifyOnNewBooking(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#C9A227' }}
              />
              <span>Notify salon desk on new appointment requests</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', color: '#171717', fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={notifyOnLeaveRequest}
                onChange={(e) => setNotifyOnLeaveRequest(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#C9A227' }}
              />
              <span>Notify admin when employee leave is requested</span>
            </label>
          </div>
        )}

        {/* TAB 6: Appearance */}
        {activeTab === 'appearance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Active UI Theme Palette</label>
              <input type="text" className="salon-input" value={themeMode} disabled style={{ opacity: 0.7, backgroundColor: '#F1EDE6' }} />
            </div>
          </div>
        )}

        {/* Form Actions Footer */}
        <div style={{ borderTop: '1px solid #E4DED4', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(201, 74, 74, 0.3)',
              backgroundColor: 'rgba(201, 74, 74, 0.1)',
              color: '#C94A4A',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={15} />
            <span>Reset Demo State</span>
          </button>

          <button type="submit" className="btn-gold" style={{ padding: '11px 26px' }}>
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
