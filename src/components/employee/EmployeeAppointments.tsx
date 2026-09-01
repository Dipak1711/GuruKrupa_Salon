import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { CompleteServiceModal } from './CompleteServiceModal';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Phone,
  Clock,
  User,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const EmployeeAppointments: React.FC = () => {
  const { activeEmployeeId } = useAuth();
  const { appointments, updateAppointmentStatus } = useSalonData();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [completionTargetApt, setCompletionTargetApt] = useState<any>(null);
  const [rejectionTargetId, setRejectionTargetId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const empAppointments = appointments.filter((a) => a.employee_id === activeEmployeeId);

  const filteredAppointments = empAppointments.filter((a) => {
    if (activeTab === 'all') return true;
    return a.status === activeTab;
  });

  const handleConfirm = (id: string) => {
    updateAppointmentStatus(id, 'confirmed');
    success('Appointment Confirmed', 'The client will be notified.');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectionTargetId) {
      updateAppointmentStatus(rejectionTargetId, 'rejected', rejectionReason);
      info('Appointment Declined', 'The request has been updated.');
      setRejectionTargetId(null);
      setRejectionReason('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Assigned Queue
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
          My Stylist Appointments
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
          Manage direct booking requests, accept incoming clients, and record completed jobs.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
        {[
          { id: 'all', label: `All (${empAppointments.length})` },
          {
            id: 'pending',
            label: `Pending Approval (${empAppointments.filter((a) => a.status === 'pending').length})`,
          },
          {
            id: 'confirmed',
            label: `Confirmed Queue (${empAppointments.filter((a) => a.status === 'confirmed').length})`,
          },
          {
            id: 'completed',
            label: `Completed (${empAppointments.filter((a) => a.status === 'completed').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: activeTab === tab.id ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: activeTab === tab.id ? 'rgba(212, 175, 55, 0.16)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === tab.id ? '#F3E5AB' : '#94A3B8',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon={<Calendar size={32} />}
          title="No Appointments Found"
          description={`There are currently no appointments in the "${activeTab}" view.`}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="glass-card"
              style={{
                padding: '22px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Badge status={apt.status} />
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    ID: #{apt.id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <h3 className="font-serif" style={{ fontSize: '1.3rem', color: '#F8FAFC', fontWeight: 600 }}>
                  {apt.service_name}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '0.84rem',
                    color: '#94A3B8',
                    flexWrap: 'wrap',
                    marginTop: '6px',
                  }}
                >
                  <span style={{ color: '#F3E5AB', fontWeight: 600 }}>Client: {apt.customer_name}</span>
                  <span>Base Price: {formatPrice(apt.service_price || 0)}</span>
                  <span>Requested: {formatDateTime(apt.created_at)}</span>
                </div>

                {apt.notes && (
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: '#CBD5E1',
                      marginTop: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    <strong>Client Note:</strong> {apt.notes}
                  </p>
                )}

                {apt.rejection_reason && (
                  <div style={{ marginTop: '6px', color: '#FB7185', fontSize: '0.82rem' }}>
                    <strong>Decline Reason:</strong> {apt.rejection_reason}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={`tel:${apt.customer_phone}`}
                  className="btn-gold-outline"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  <Phone size={13} color="#D4AF37" />
                  <span>Call {apt.customer_name.split(' ')[0]}</span>
                </a>

                {apt.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleConfirm(apt.id)}
                      style={{
                        padding: '9px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#38BDF8',
                        color: '#0A0C10',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setRejectionTargetId(apt.id)}
                      style={{
                        padding: '9px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        backgroundColor: 'rgba(244, 63, 94, 0.1)',
                        color: '#FB7185',
                        fontSize: '0.84rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Decline
                    </button>
                  </>
                )}

                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => setCompletionTargetApt(apt)}
                    className="btn-gold"
                    style={{ padding: '9px 18px', fontSize: '0.86rem' }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Complete Service</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completion Modal */}
      <CompleteServiceModal
        isOpen={Boolean(completionTargetApt)}
        onClose={() => setCompletionTargetApt(null)}
        appointment={completionTargetApt}
        employeeId={activeEmployeeId}
      />

      {/* Rejection Dialog */}
      {rejectionTargetId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(5, 7, 10, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '16px',
          }}
        >
          <form
            onSubmit={handleRejectSubmit}
            className="glass-card"
            style={{ width: '100%', maxWidth: '440px', padding: '24px' }}
          >
            <h3 className="font-serif" style={{ fontSize: '1.3rem', color: '#F8FAFC', marginBottom: '8px' }}>
              Decline Appointment Request
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', marginBottom: '16px' }}>
              Please provide a reason for declining this request so the salon desk can assist the client.
            </p>
            <textarea
              className="salon-input"
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Schedule fully committed or specialized treatment required..."
              style={{ marginBottom: '18px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectionTargetId(null)}
                className="btn-dark"
                style={{ padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Confirm Decline
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
