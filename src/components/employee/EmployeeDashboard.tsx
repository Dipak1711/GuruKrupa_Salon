import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { CompleteServiceModal } from './CompleteServiceModal';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import {
  DollarSign,
  TrendingUp,
  CalendarCheck,
  Clock,
  CheckCircle2,
  PlusCircle,
  Phone,
  Sparkles,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EmployeeDashboardProps {
  onNavigateToView?: (view: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigateToView }) => {
  const { activeEmployeeId } = useAuth();
  const { employees, appointments, serviceRecords, getEmployeeStats, updateAppointmentStatus } =
    useSalonData();

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [activeAppointmentForCompletion, setActiveAppointmentForCompletion] = useState<any>(null);

  const currentEmployee = employees.find((e) => e.id === activeEmployeeId) || employees[0];
  const stats = getEmployeeStats(activeEmployeeId);

  // Stylist's appointments
  const empAppointments = appointments.filter((a) => a.employee_id === activeEmployeeId);
  const pendingAppointments = empAppointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = empAppointments.filter((a) => a.status === 'confirmed');

  // Recent completed work by this stylist
  const stylistRecords = serviceRecords.filter((r) => r.employee_id === activeEmployeeId).slice(0, 5);

  const handleStartCompletion = (apt: any) => {
    setActiveAppointmentForCompletion(apt);
    setIsCompleteModalOpen(true);
  };

  const handleOpenWalkIn = () => {
    setActiveAppointmentForCompletion(null);
    setIsCompleteModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Welcome & Quick Actions */}
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
            Master Stylist Workspace
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
            Welcome, {currentEmployee.name}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '2px' }}>
            {currentEmployee.role_title} • {currentEmployee.specialization}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleOpenWalkIn} className="btn-gold" style={{ padding: '11px 22px' }}>
            <PlusCircle size={17} />
            <span>Add Walk-in Service</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '18px',
        }}
      >
        <StatCard
          title="Today's Revenue"
          value={formatPrice(stats.todayRevenue)}
          icon={<DollarSign size={22} />}
          subtitle="Generated today"
          trend="+12%"
          trendPositive
        />
        <StatCard
          title="This Month Revenue"
          value={formatPrice(stats.monthRevenue)}
          icon={<TrendingUp size={22} />}
          subtitle="Month to date"
        />
        <StatCard
          title="Today's Active Queue"
          value={confirmedAppointments.length + pendingAppointments.length}
          icon={<CalendarCheck size={22} />}
          subtitle={`${pendingAppointments.length} pending approval`}
        />
        <StatCard
          title="Completed Services"
          value={stats.completedCount}
          icon={<CheckCircle2 size={22} />}
          subtitle="Lifetime executed"
        />
      </div>

      {/* Active Appointment Queue Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC', fontWeight: 600 }}>
            Today's Assigned Appointments ({empAppointments.filter((a) => a.status !== 'completed' && a.status !== 'cancelled').length})
          </h3>

          {onNavigateToView && (
            <button
              onClick={() => onNavigateToView('my-appointments')}
              className="btn-gold-outline"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              View Full Queue
            </button>
          )}
        </div>

        {empAppointments.filter((a) => a.status !== 'completed' && a.status !== 'cancelled').length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '32px',
              textAlign: 'center',
              color: '#94A3B8',
              fontSize: '0.9rem',
            }}
          >
            No active appointments in your queue right now. You can serve walk-in clients using the "Add Walk-in Service" button.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {empAppointments
              .filter((a) => a.status !== 'completed' && a.status !== 'cancelled')
              .map((apt) => (
                <div
                  key={apt.id}
                  className="glass-card"
                  style={{
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <Badge status={apt.status} size="sm" />
                      <h4 style={{ fontSize: '1.15rem', color: '#F8FAFC', fontWeight: 600 }}>
                        {apt.service_name}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.84rem', color: '#94A3B8' }}>
                      <span style={{ color: '#F3E5AB', fontWeight: 600 }}>Client: {apt.customer_name}</span>
                      <span>Fee: {formatPrice(apt.service_price || 0)}</span>
                      <span>Requested: {formatDateTime(apt.created_at)}</span>
                    </div>

                    {apt.notes && (
                      <p style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '6px' }}>
                        <strong>Note:</strong> {apt.notes}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Direct Call link */}
                    <a
                      href={`tel:${apt.customer_phone}`}
                      className="btn-gold-outline"
                      style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      <Phone size={13} color="#D4AF37" />
                      <span>Call Client</span>
                    </a>

                    {/* Pending state actions */}
                    {apt.status === 'pending' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: '#38BDF8',
                          color: '#0A0C10',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Accept & Confirm
                      </button>
                    )}

                    {/* Complete Service Button */}
                    <button
                      onClick={() => handleStartCompletion(apt)}
                      className="btn-gold"
                      style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                    >
                      <CheckCircle2 size={15} />
                      <span>Complete Service</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Recent Completed Work & Revenue Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC', fontWeight: 600 }}>
          Recent Completed Services & Revenue
        </h3>

        {stylistRecords.length === 0 ? (
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>
            No recent completed service records found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stylistRecords.map((rec) => (
              <div
                key={rec.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.96rem', fontWeight: 600, color: '#F8FAFC' }}>
                      {rec.items.map((i) => i.service_name).join(' + ')}
                    </span>
                    {rec.is_walkin && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(212, 175, 55, 0.15)',
                          color: '#D4AF37',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          fontWeight: 600,
                        }}
                      >
                        Walk-in
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    Client: {rec.customer_name} • Paid via {rec.payment.payment_method} • {formatDateTime(rec.completed_at)}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10B981' }}>
                    +{formatPrice(rec.total_amount)}
                  </div>
                  {rec.discount > 0 && (
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                      Discount: {formatPrice(rec.discount)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complete Service Modal */}
      <CompleteServiceModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setActiveAppointmentForCompletion(null);
        }}
        appointment={activeAppointmentForCompletion}
        employeeId={activeEmployeeId}
      />
    </div>
  );
};
