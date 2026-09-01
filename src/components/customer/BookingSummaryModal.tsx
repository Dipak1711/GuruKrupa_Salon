import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Service, Employee } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currency';
import { triggerBookingConfetti } from '../../utils/confetti';
import { Sparkles, Scissors, User, Phone, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface BookingSummaryModalProps {
  service: Service | null;
  stylist: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
}

export const BookingSummaryModal: React.FC<BookingSummaryModalProps> = ({
  service,
  stylist,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const { currentUser } = useAuth();
  const { createAppointment } = useSalonData();
  const { success } = useToast();

  const [customerName, setCustomerName] = useState(currentUser.name || 'Aditya Sonawane');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+919811223344');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!service || !stylist) return null;

  const handleConfirmBooking = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      createAppointment({
        customerId: currentUser.id,
        customerName,
        customerPhone,
        serviceId: service.id,
        employeeId: stylist.id,
        notes,
      });

      // Celebration
      triggerBookingConfetti();
      success(
        'Booking Request Submitted!',
        `Your request for ${service.name} with ${stylist.name} has been sent. Status: Pending Confirmation.`
      );

      setIsSubmitting(false);
      onClose();
      onBookingSuccess();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="#D4AF37" />
          <span className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC' }}>
            Booking Summary
          </span>
        </div>
      }
      subtitle="Review your direct stylist booking request before confirmation"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top summary card */}
        <div
          className="glass-card"
          style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Service details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={service.images[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'}
              alt={service.name}
              style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(212, 175, 55, 0.4)' }}
            />
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Selected Service
              </span>
              <h4 className="font-serif" style={{ fontSize: '1.2rem', color: '#F8FAFC', fontWeight: 600 }}>
                {service.name}
              </h4>
              <span style={{ fontSize: '0.84rem', color: '#D4AF37' }}>
                Est. Duration: {service.duration_mins} mins
              </span>
            </div>
          </div>

          {/* Price badge */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>
              Service Fee
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F3E5AB' }}>
              {formatPrice(service.price)}
            </div>
          </div>
        </div>

        {/* Stylist Profile Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={stylist.avatar_url}
              alt={stylist.name}
              style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }}
            />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 600 }}>
                Assigned Master Stylist
              </span>
              <h4 style={{ fontSize: '1.05rem', color: '#F8FAFC', fontWeight: 600 }}>
                {stylist.name}
              </h4>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                {stylist.role_title} • {stylist.experience_years} Years Exp.
              </span>
            </div>
          </div>

          <a
            href={`tel:${stylist.phone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#F3E5AB',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Phone size={14} color="#D4AF37" />
            <span>Call Stylist</span>
          </a>
        </div>

        {/* Customer Contact Details Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Your Full Name
            </label>
            <input
              type="text"
              className="salon-input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full Name"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Contact Phone Number
            </label>
            <input
              type="tel"
              className="salon-input"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 Phone"
              required
            />
          </div>
        </div>

        {/* Special Instructions / Notes */}
        <div>
          <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
            Special Requests / Style Notes (Optional)
          </label>
          <textarea
            className="salon-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Skin fade preferences, specific hair styling reference, or organic oil request..."
          />
        </div>

        {/* Important Salon Booking Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
          }}
        >
          <ShieldCheck size={18} color="#38BDF8" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '0.82rem', color: '#BAE6FD', lineHeight: 1.45 }}>
            <strong>Direct Booking Policy:</strong> Your booking request is placed directly with {stylist.name}. The salon desk will confirm and notify you. Payment is made at the salon upon service completion.
          </p>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '18px',
            marginTop: '4px',
          }}
        >
          <button onClick={onClose} className="btn-dark" style={{ padding: '11px 20px' }}>
            Back
          </button>

          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting || !customerName || !customerPhone}
            className="btn-gold"
            style={{ padding: '12px 28px', fontSize: '0.96rem' }}
          >
            <CheckCircle2 size={18} />
            <span>{isSubmitting ? 'Submitting Request...' : 'Confirm Booking'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Modal>
  );
};
