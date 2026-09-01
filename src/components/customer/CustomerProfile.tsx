import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Mail, Save, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { appointments } = useSalonData();
  const { success } = useToast();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url);
  const [isSaving, setIsSaving] = useState(false);

  const customerAppointments = appointments.filter(
    (a) => a.customer_id === currentUser.id || a.customer_phone === currentUser.phone
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateUserProfile({
        name,
        email,
        phone,
        avatar_url: avatarUrl,
      });
      success('Profile Updated', 'Your customer details have been saved.');
      setIsSaving(false);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '840px', margin: '0 auto' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Account & Preferences
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
          Customer Profile
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
          Manage your personal contact details, booking preferences, and salon membership.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Membership Tier</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F3E5AB' }}>
              Gold VIP
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <img
            src={avatarUrl}
            alt={name}
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }}
          />
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Avatar Image URL
            </label>
            <input
              type="url"
              className="salon-input"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <User size={14} color="#D4AF37" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              className="salon-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Mail size={14} color="#D4AF37" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              className="salon-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Phone size={14} color="#D4AF37" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              className="salon-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <ShieldCheck size={14} color="#D4AF37" />
              <span>Account Role</span>
            </label>
            <input
              type="text"
              className="salon-input"
              value="Customer"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
          <button type="submit" disabled={isSaving} className="btn-gold" style={{ padding: '12px 28px' }}>
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
