import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Settings, Phone, Clock, MapPin, Shield, Save, RotateCcw } from 'lucide-react';
import { useSalonData } from '../../context/SalonDataContext';

export const SettingsView: React.FC = () => {
  const { resetToDemoData } = useSalonData();
  const { success, info } = useToast();

  const [salonName, setSalonName] = useState('GuruKrupa SALON');
  const [tagline, setTagline] = useState('Luxury Grooming & Stylist Studio');
  const [hotline, setHotline] = useState('+919823012345');
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('09:30 PM');
  const [address, setAddress] = useState('Shop 4-5, Royal Grandeur Avenue, Linking Road, Bandra West, Mumbai, Maharashtra 400050');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Saved', 'Operational configurations and salon metadata updated.');
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo state to fresh default seed data?')) {
      resetToDemoData();
      info('Reset Done', 'All database state and financial transactions re-seeded.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '880px', margin: '0 auto' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Configuration & Environment
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
          Salon System Settings
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
          Manage salon operating timings, direct VIP telephone links, addresses, and database state.
        </p>
      </div>

      <form onSubmit={handleSave} className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Salon Name</label>
            <input type="text" className="salon-input" value={salonName} onChange={(e) => setSalonName(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Tagline</label>
            <input type="text" className="salon-input" value={tagline} onChange={(e) => setTagline(e.target.value)} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Direct Phone Hotline (tel: link)</label>
            <input type="tel" className="salon-input" value={hotline} onChange={(e) => setHotline(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Opening Time</label>
            <input type="text" className="salon-input" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Closing Time</label>
            <input type="text" className="salon-input" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} required />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Physical Salon Address</label>
          <textarea className="salon-input" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              color: '#FB7185',
              fontSize: '0.84rem',
              fontWeight: 500,
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
