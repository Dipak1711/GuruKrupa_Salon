import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import { CalendarCheck, Phone, XCircle, Clock, CheckCircle2, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

interface CustomerAppointmentsProps {
  onNavigateToBooking?: () => void;
}

export const CustomerAppointments: React.FC<CustomerAppointmentsProps> = ({ onNavigateToBooking }) => {
  const { currentUser } = useAuth();
  const { appointments, updateAppointmentStatus } = useSalonData();
  const { info } = useToast();

  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  // Filter appointments for current customer
  const myAppointments = appointments.filter(
    (apt) =>
      apt.customer_id === currentUser.id ||
      apt.customer_phone === currentUser.phone ||
      apt.customer_name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  );

  const handleCancel = () => {
    if (cancelTargetId) {
      updateAppointmentStatus(cancelTargetId, 'cancelled');
      info('Appointment Cancelled', 'Your appointment request has been cancelled.');
      setCancelTargetId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Booking History & Status
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: '#F8FAFC', fontWeight: 700 }}>
            My Appointments
          </h2>
        </div>

        {onNavigateToBooking && (
          <button onClick={onNavigateToBooking} className="btn-gold" style={{ padding: '10px 20px' }}>
            <Sparkles size={16} />
            <span>Book New Service</span>
          </button>
        )}
      </div>

      {/* Appointment Cards List */}
      {myAppointments.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck size={32} />}
          title="No Appointments Found"
          description="You haven't requested any salon services yet. Browse our luxury services and book your favorite master stylist!"
          action={
            onNavigateToBooking
              ? {
                  label: 'Explore Services & Book',
                  onClick: onNavigateToBooking,
                }
              : undefined
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myAppointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              {/* Left Details */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Badge status={apt.status} />
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    ID: #{apt.id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <h3
                  className="font-serif"
                  style={{ fontSize: '1.35rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '4px' }}
                >
                  {apt.service_name}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '0.86rem',
                    color: '#94A3B8',
                    flexWrap: 'wrap',
                    marginTop: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={15} color="#D4AF37" />
                    <span>Stylist: <strong style={{ color: '#F3E5AB' }}>{apt.employee_name}</strong></span>
                  </div>

                  {apt.service_price !== undefined && (
                    <div style={{ color: '#F8FAFC', fontWeight: 600 }}>
                      Fee: {formatPrice(apt.service_price)}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color="#64748B" />
                    <span>Requested: {formatDateTime(apt.created_at)}</span>
                  </div>
                </div>

                {apt.notes && (
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: '#CBD5E1',
                      marginTop: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      borderLeft: '2px solid #D4AF37',
                    }}
                  >
                    <strong>Note:</strong> {apt.notes}
                  </p>
                )}

                {apt.status === 'confirmed' && apt.confirmed_at && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontSize: '0.82rem' }}>
                    <CheckCircle2 size={15} />
                    <span>Confirmed by salon desk on {formatDateTime(apt.confirmed_at)}</span>
                  </div>
                )}

                {apt.status === 'completed' && apt.completed_at && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.82rem' }}>
                    <CheckCircle2 size={15} />
                    <span>Completed & Paid on {formatDateTime(apt.completed_at)}</span>
                  </div>
                )}

                {apt.rejection_reason && (
                  <div style={{ marginTop: '10px', color: '#FB7185', fontSize: '0.82rem' }}>
                    <strong>Reason for decline:</strong> {apt.rejection_reason}
                  </div>
                )}
              </div>

              {/* Right Action buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexShrink: 0,
                }}
              >
                {/* Direct Call Stylist button */}
                {apt.employee_phone && (
                  <a
                    href={`tel:${apt.employee_phone}`}
                    className="btn-gold-outline"
                    style={{ padding: '9px 14px', fontSize: '0.84rem' }}
                  >
                    <Phone size={14} color="#D4AF37" />
                    <span>Call Stylist</span>
                  </a>
                )}

                {/* Cancel pending appointment */}
                {apt.status === 'pending' && (
                  <button
                    onClick={() => setCancelTargetId(apt.id)}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      backgroundColor: 'rgba(244, 63, 94, 0.08)',
                      color: '#FB7185',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.08)';
                    }}
                  >
                    <XCircle size={15} />
                    <span>Cancel Request</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancelTargetId)}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleCancel}
        title="Cancel Appointment Request?"
        message="Are you sure you want to cancel this pending booking request? You can always request a new service anytime."
        confirmLabel="Yes, Cancel Booking"
        isDestructive
      />
    </div>
  );
};
