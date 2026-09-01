import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { LeaveType, LeaveStatus, EmployeeLeave } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/dates';
import { CalendarX, Plus, Trash2, Edit2, Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LeaveManager: React.FC = () => {
  const { employees, employeeLeaves, addEmployeeLeave, updateEmployeeLeaveStatus, deleteEmployeeLeave } =
    useSalonData();
  const { success, error, info } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<EmployeeLeave | null>(null);

  // Filters state
  const [empFilter, setEmpFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<LeaveType>('full_day');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const handleOpenAddModal = () => {
    setEditingLeave(null);
    setSelectedEmpId(employees.find((e) => e.is_active)?.id || employees[0]?.id || '');
    setLeaveType('full_day');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setReason('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (leave: EmployeeLeave) => {
    setEditingLeave(leave);
    setSelectedEmpId(leave.employee_id);
    setLeaveType(leave.leave_type);
    setStartDate(leave.start_date);
    setEndDate(leave.end_date);
    setReason(leave.reason);
    setIsAddModalOpen(true);
  };

  // Filtered leave records
  const filteredLeaves = employeeLeaves.filter((leave) => {
    const matchesEmp = empFilter === 'all' || leave.employee_id === empFilter;
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesSearch =
      leave.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (leave.employee_name && leave.employee_name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesEmp && matchesStatus && matchesSearch;
  });

  const handleSaveLeave = (e: React.FormEvent) => {
    e.preventDefault();

    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!emp) {
      error('Invalid Employee', 'Please select a valid employee.');
      return;
    }

    // Rule 1: Inactive employee leave prevention
    if (!emp.is_active) {
      error('Inactive Employee', 'Cannot create a leave record for a disabled/inactive employee.');
      return;
    }

    // Rule 2: End date before start date validation
    if (new Date(endDate) < new Date(startDate)) {
      error('Invalid Date Range', 'End date cannot be earlier than start date.');
      return;
    }

    // Rule 3: Overlapping approved leave validation for same employee
    const overlapping = employeeLeaves.find((l) => {
      // Exclude current editing record if editing
      if (editingLeave && l.id === editingLeave.id) return false;
      if (l.employee_id !== selectedEmpId) return false;
      if (l.status !== 'approved') return false;

      // Check date range overlap: (startA <= endB) AND (endA >= startB)
      const startA = new Date(startDate);
      const endA = new Date(endDate);
      const startB = new Date(l.start_date);
      const endB = new Date(l.end_date);

      return startA <= endB && endA >= startB;
    });

    if (overlapping) {
      error(
        'Overlapping Approved Leave',
        `${emp.name} already has an approved leave scheduled from ${formatDate(overlapping.start_date)} to ${formatDate(overlapping.end_date)}.`
      );
      return;
    }

    if (editingLeave) {
      // Update leave record status/dates
      updateEmployeeLeaveStatus(editingLeave.id, 'approved');
      success('Leave Updated', `Leave updated for ${emp.name}.`);
    } else {
      // Add new leave record
      addEmployeeLeave({
        employee_id: selectedEmpId,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
        status: 'approved',
      });
      success('Leave Approved', `${emp.name} marked on leave from ${startDate} to ${endDate}. Booking availability updated.`);
    }

    setIsAddModalOpen(false);
    setReason('');
  };

  const handleCancelLeave = (id: string, empName?: string) => {
    updateEmployeeLeaveStatus(id, 'cancelled');
    info('Leave Cancelled', `Leave for ${empName || 'stylist'} cancelled. Employee is available for bookings again.`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this leave record permanently?')) {
      deleteEmployeeLeave(id);
      success('Deleted', 'Leave record removed from history.');
    }
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
            Availability & Roster Schedule
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
            Employee Leave Management ({employeeLeaves.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
            Employees on approved leave will automatically be blocked from customer booking selection during their leave dates.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn-gold" style={{ padding: '11px 22px' }}>
          <Plus size={18} />
          <span>Record New Leave</span>
        </button>
      </div>

      {/* Search & Filter Controls Bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            className="salon-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reason or stylist name..."
            style={{ paddingLeft: '40px' }}
          />
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Employee Filter */}
        <div style={{ width: '200px' }}>
          <select
            className="salon-select"
            value={empFilter}
            onChange={(e) => setEmpFilter(e.target.value)}
          >
            <option value="all">All Stylists</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ width: '170px' }}>
          <select
            className="salon-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Leaves History Audit Table */}
      <div className="glass-card table-responsive-wrapper" style={{ padding: '24px' }}>
        {filteredLeaves.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
            <CalendarX size={32} color="#D4AF37" style={{ marginBottom: '10px' }} />
            <h4 style={{ color: '#F8FAFC', fontSize: '1.1rem', marginBottom: '4px' }}>No Leave Records Found</h4>
            <p style={{ fontSize: '0.86rem' }}>Try clearing filters or search query.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Stylist</th>
                <th style={{ padding: '12px 14px' }}>Leave Type</th>
                <th style={{ padding: '12px 14px' }}>Date Span</th>
                <th style={{ padding: '12px 14px' }}>Reason</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((l) => {
                const emp = employees.find((e) => e.id === l.employee_id);
                return (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.88rem' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {emp && (
                          <img
                            src={emp.avatar_url}
                            alt={emp.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <div style={{ color: '#F8FAFC', fontWeight: 600 }}>{l.employee_name || emp?.name}</div>
                          <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{emp?.role_title}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <Badge
                        status={l.leave_type === 'full_day' ? 'full_day' : 'half_day'}
                        label={l.leave_type === 'full_day' ? 'Full Day' : 'Half Day'}
                        size="sm"
                      />
                    </td>

                    <td style={{ padding: '14px', color: '#F3E5AB', fontWeight: 500 }}>
                      {formatDate(l.start_date)}
                      {l.start_date !== l.end_date && ` → ${formatDate(l.end_date)}`}
                    </td>

                    <td style={{ padding: '14px', color: '#CBD5E1', maxWidth: '240px' }}>
                      {l.reason}
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          backgroundColor:
                            l.status === 'approved'
                              ? 'rgba(16, 185, 129, 0.12)'
                              : l.status === 'cancelled'
                              ? 'rgba(244, 63, 94, 0.12)'
                              : 'rgba(245, 158, 11, 0.12)',
                          color:
                            l.status === 'approved'
                              ? '#10B981'
                              : l.status === 'cancelled'
                              ? '#FB7185'
                              : '#F59E0B',
                          textTransform: 'uppercase',
                        }}
                      >
                        {l.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {l.status === 'approved' && (
                          <button
                            onClick={() => handleCancelLeave(l.id, l.employee_name || emp?.name)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(244, 63, 94, 0.1)',
                              border: '1px solid rgba(244, 63, 94, 0.3)',
                              color: '#FB7185',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              minHeight: '36px',
                            }}
                          >
                            Cancel Leave
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(l.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748B',
                            cursor: 'pointer',
                            padding: '6px',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Record / Edit Leave Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarX size={20} color="#F43F5E" />
            <span className="font-serif" style={{ fontSize: '1.35rem', color: '#F8FAFC' }}>
              {editingLeave ? 'Edit Leave Record' : 'Schedule Staff Leave'}
            </span>
          </div>
        }
        subtitle="Stylist will be blocked from customer booking selection during approved dates."
      >
        <form onSubmit={handleSaveLeave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Select Stylist *
            </label>
            <select
              className="salon-select"
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              required
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} disabled={!emp.is_active}>
                  {emp.name} ({emp.role_title}) {!emp.is_active && '[Inactive - Disabled]'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Leave Duration Type *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setLeaveType('full_day')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: leaveType === 'full_day' ? '1.5px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: leaveType === 'full_day' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: leaveType === 'full_day' ? '#F3E5AB' : '#94A3B8',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Full Day
              </button>
              <button
                type="button"
                onClick={() => setLeaveType('half_day')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: leaveType === 'half_day' ? '1.5px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: leaveType === 'half_day' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: leaveType === 'half_day' ? '#F3E5AB' : '#94A3B8',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Half Day
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Start Date *
              </label>
              <input
                type="date"
                className="salon-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                End Date *
              </label>
              <input
                type="date"
                className="salon-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Reason for Leave *
            </label>
            <textarea
              className="salon-input"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Wedding celebration, medical checkup, personal rest..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-dark" style={{ padding: '10px 18px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-gold" style={{ padding: '10px 22px', minHeight: '44px' }}>
              <CheckCircle2 size={16} />
              <span>Confirm & Approve Leave</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
