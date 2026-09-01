import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import {
  Calendar,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Scissors,
  Filter,
} from 'lucide-react';

export const AppointmentManager: React.FC = () => {
  const { appointments, updateAppointmentStatus, employees, activeBranchId } = useSalonData();
  const { success, info } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [empFilter, setEmpFilter] = useState<string>('all');

  const branchAppointments = appointments.filter((apt) => !apt.branch_id || apt.branch_id === activeBranchId);
  const branchEmployees = employees.filter((emp) => emp.branch_id === activeBranchId);

  const filtered = branchAppointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesEmp = empFilter === 'all' || apt.employee_id === empFilter;
    return matchesStatus && matchesEmp;
  });

  const handleStatusChange = (id: string, newStatus: any) => {
    updateAppointmentStatus(id, newStatus);
    success('Status Updated', `Appointment status updated to ${newStatus}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
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
            Operations & Queue
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
            Salon-Wide Appointments ({appointments.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
            Full master queue across all stylists. Review pending requests, confirm, or modify statuses.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="salon-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="salon-select"
            value={empFilter}
            onChange={(e) => setEmpFilter(e.target.value)}
            style={{ padding: '8px 12px', width: 'auto' }}
          >
            <option value="all">All Stylists</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
            No appointments match the selected filter criteria.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '760px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Client Info</th>
                <th style={{ padding: '12px' }}>Requested Service</th>
                <th style={{ padding: '12px' }}>Assigned Stylist</th>
                <th style={{ padding: '12px' }}>Fee</th>
                <th style={{ padding: '12px' }}>Created Timestamp</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.88rem' }}>
                  <td style={{ padding: '12px' }}>
                    <Badge status={apt.status} size="sm" />
                  </td>

                  <td style={{ padding: '12px' }}>
                    <div style={{ color: '#F8FAFC', fontWeight: 600 }}>{apt.customer_name}</div>
                    <a
                      href={`tel:${apt.customer_phone}`}
                      style={{ fontSize: '0.78rem', color: '#38BDF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Phone size={11} />
                      <span>{apt.customer_phone}</span>
                    </a>
                  </td>

                  <td style={{ padding: '12px', color: '#CBD5E1' }}>
                    {apt.service_name}
                    {apt.notes && (
                      <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '2px' }}>
                        Note: {apt.notes}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '12px', color: '#F3E5AB', fontWeight: 500 }}>
                    {apt.employee_name}
                  </td>

                  <td style={{ padding: '12px', fontWeight: 600, color: '#10B981' }}>
                    {formatPrice(apt.service_price || 0)}
                  </td>

                  <td style={{ padding: '12px', color: '#94A3B8', fontSize: '0.8rem' }}>
                    {formatDateTime(apt.created_at)}
                  </td>

                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      {apt.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'confirmed')}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            backgroundColor: '#38BDF8',
                            color: '#0A0C10',
                            border: 'none',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Confirm
                        </button>
                      )}

                      {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'cancelled')}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(244, 63, 94, 0.1)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            color: '#FB7185',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
