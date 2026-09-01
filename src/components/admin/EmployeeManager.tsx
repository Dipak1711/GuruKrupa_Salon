import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { Employee, LeaveType } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import {
  Users,
  Plus,
  Edit2,
  CalendarX,
  Phone,
  Star,
  Award,
  Scissors,
  CheckCircle2,
  EyeOff,
  Eye,
  BarChart3,
  DollarSign,
  TrendingUp,
  History,
  ShieldCheck,
  UserCheck,
  UserX,
} from 'lucide-react';

interface EmployeeManagerProps {
  onOpenLeaveManager?: () => void;
}

export const EmployeeManager: React.FC<EmployeeManagerProps> = ({ onOpenLeaveManager }) => {
  const {
    employees,
    services,
    employeeLeaves,
    serviceRecords,
    activeBranchId,
    addEmployee,
    updateEmployee,
    toggleEmployeeActive,
    addEmployeeLeave,
    isEmployeeAvailable,
    getEmployeeStats,
  } = useSalonData();
  const { success, info } = useToast();

  const branchEmployees = employees.filter((e) => e.branch_id === activeBranchId);

  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [viewEmpDetail, setViewEmpDetail] = useState<Employee | null>(null);

  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [targetLeaveEmp, setTargetLeaveEmp] = useState<Employee | null>(null);

  // Form states for Employee CRUD
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('Master Stylist');
  const [experienceYears, setExperienceYears] = useState(5);
  const [specialization, setSpecialization] = useState('');
  const [phone, setPhone] = useState('+919823012345');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [assignedServiceIds, setAssignedServiceIds] = useState<string[]>([]);

  // Form states for Leave
  const [leaveType, setLeaveType] = useState<LeaveType>('full_day');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const handleOpenAddEmp = () => {
    setEditingEmp(null);
    setName('');
    setRoleTitle('Master Stylist & Karigar');
    setExperienceYears(5);
    setSpecialization('Precision Scissor Cut & Beard Architecture');
    setPhone('+919823012345');
    setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80');
    setBio('Certified master stylist trained in luxury precision cuts and spa relaxation.');
    setAssignedServiceIds(services.map((s) => s.id));
    setIsEmpModalOpen(true);
  };

  const handleOpenEditEmp = (emp: Employee) => {
    setEditingEmp(emp);
    setName(emp.name);
    setRoleTitle(emp.role_title);
    setExperienceYears(emp.experience_years);
    setSpecialization(emp.specialization);
    setPhone(emp.phone);
    setAvatarUrl(emp.avatar_url);
    setBio(emp.bio);
    setAssignedServiceIds(emp.assigned_service_ids || []);
    setIsEmpModalOpen(true);
  };

  const handleSaveEmp = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate service assignments
    const uniqueServiceIds = Array.from(new Set(assignedServiceIds));

    if (editingEmp) {
      updateEmployee(editingEmp.id, {
        name,
        role_title: roleTitle,
        experience_years: Number(experienceYears),
        specialization,
        phone,
        avatar_url: avatarUrl,
        bio,
        assigned_service_ids: uniqueServiceIds,
      });
      success('Stylist Updated', `${name}'s profile and service assignments saved.`);
    } else {
      addEmployee({
        branch_id: activeBranchId,
        name,
        role_title: roleTitle,
        experience_years: Number(experienceYears),
        specialization,
        phone,
        avatar_url: avatarUrl,
        bio,
        rating: 4.9,
        reviews_count: 0,
        is_active: true,
        assigned_service_ids: uniqueServiceIds,
      });
      success('Stylist Added', `${name} registered to the salon team.`);
    }

    setIsEmpModalOpen(false);
  };

  const handleOpenLeaveModal = (emp: Employee) => {
    setTargetLeaveEmp(emp);
    setLeaveType('full_day');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setReason('');
    setIsLeaveModalOpen(true);
  };

  const handleSaveLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLeaveEmp) return;

    addEmployeeLeave({
      employee_id: targetLeaveEmp.id,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
      status: 'approved',
    });

    success(
      'Leave Logged',
      `${targetLeaveEmp.name} marked on leave. Customer booking availability locked accordingly.`
    );
    setIsLeaveModalOpen(false);
  };

  const handleToggleStatus = (emp: Employee) => {
    toggleEmployeeActive(emp.id);
    info(
      'Stylist Status Updated',
      `${emp.name} is now ${emp.is_active ? 'Inactive (Disabled)' : 'Active'}.`
    );
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
            Staff & Performance Command Center
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
            Employee Management ({employees.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
            Register staff, assign qualified services, view verified revenue analytics, and manage leave availability.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {onOpenLeaveManager && (
            <button onClick={onOpenLeaveManager} className="btn-gold-outline" style={{ padding: '10px 18px' }}>
              <CalendarX size={16} />
              <span>Leave History</span>
            </button>
          )}
          <button onClick={handleOpenAddEmp} className="btn-gold" style={{ padding: '10px 22px' }}>
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Employees Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {branchEmployees.map((emp) => {
          const isAvailable = isEmployeeAvailable(emp.id);
          const empStats = getEmployeeStats(emp.id);
          const assignedServices = services.filter((s) => emp.assigned_service_ids.includes(s.id));

          return (
            <div
              key={emp.id}
              className="glass-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                opacity: emp.is_active ? 1 : 0.6,
                border: emp.is_active
                  ? isAvailable
                    ? '1px solid rgba(212, 175, 55, 0.25)'
                    : '1px dashed rgba(244, 63, 94, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Top Row: Avatar & Metadata */}
              <div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <img
                    src={emp.avatar_url}
                    alt={emp.name}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: emp.is_active
                        ? isAvailable
                          ? '2px solid #D4AF37'
                          : '2px solid #F43F5E'
                        : '2px solid #64748B',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#F8FAFC', fontWeight: 600 }}>
                        {emp.name}
                      </h3>
                      {!emp.is_active ? (
                        <span style={{ fontSize: '0.7rem', color: '#FB7185', backgroundColor: 'rgba(244, 63, 94, 0.12)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          Disabled
                        </span>
                      ) : isAvailable ? (
                        <Badge status="available" size="sm" label="Available" />
                      ) : (
                        <Badge status="leave" size="sm" label="On Leave" />
                      )}
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#D4AF37', fontWeight: 500 }}>
                      {emp.role_title}
                    </p>

                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                      {emp.experience_years} Yrs Exp. • ★ {emp.rating} ({emp.reviews_count})
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '12px' }}>
                  <strong>Specialization:</strong> {emp.specialization}
                </div>

                {/* Revenue & Service Statistics (No manual revenue editing allowed) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    marginBottom: '14px',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <span style={{ color: '#94A3B8', fontSize: '0.72rem', display: 'block' }}>Total Revenue</span>
                    <strong style={{ color: '#10B981', fontSize: '0.95rem' }}>{formatPrice(empStats.totalRevenue)}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', fontSize: '0.72rem', display: 'block' }}>Clients</span>
                    <strong style={{ fontSize: '0.95rem', color: '#F8FAFC' }}>{empStats.clientsCount}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', fontSize: '0.72rem', display: 'block' }}>Skills</span>
                    <strong style={{ color: '#F3E5AB', fontSize: '0.95rem' }}>{assignedServices.length}</strong>
                  </div>
                </div>

                {/* Assigned Services Badges */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {assignedServices.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#94A3B8',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                  {assignedServices.length > 3 && (
                    <span style={{ fontSize: '0.7rem', color: '#D4AF37', alignSelf: 'center' }}>
                      +{assignedServices.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '14px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', gap: '6px' }}>
                  {/* View Details Modal button */}
                  <button
                    onClick={() => setViewEmpDetail(emp)}
                    className="btn-dark"
                    style={{ padding: '6px 12px', fontSize: '0.78rem', minHeight: '40px' }}
                  >
                    <BarChart3 size={14} color="#D4AF37" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => handleOpenLeaveModal(emp)}
                    style={{
                      padding: '6px 10px',
                      minHeight: '40px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(244, 63, 94, 0.1)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      color: '#FB7185',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CalendarX size={13} />
                    <span>Leave</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {/* Disable / Activate Toggle */}
                  <button
                    onClick={() => handleToggleStatus(emp)}
                    title={emp.is_active ? 'Disable Employee' : 'Activate Employee'}
                    style={{
                      padding: '6px 10px',
                      minHeight: '40px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: emp.is_active ? '#94A3B8' : '#10B981',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {emp.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                    <span>{emp.is_active ? 'Disable' : 'Activate'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditEmp(emp)}
                    className="btn-gold-outline"
                    style={{ padding: '6px 12px', fontSize: '0.78rem', minHeight: '40px' }}
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADMIN EMPLOYEE DETAILS MODAL (Prompt requirement) */}
      <Modal
        isOpen={!!viewEmpDetail}
        onClose={() => setViewEmpDetail(null)}
        maxWidth="2xl"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={20} color="#D4AF37" />
            <span className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC' }}>
              Employee Performance: {viewEmpDetail?.name}
            </span>
          </div>
        }
        subtitle="Verified sales metrics derived from immutable service records."
      >
        {viewEmpDetail && (() => {
          const empStats = getEmployeeStats(viewEmpDetail.id);
          const empRecords = serviceRecords.filter((r) => r.employee_id === viewEmpDetail.id);
          const assignedServices = services.filter((s) => viewEmpDetail.assigned_service_ids.includes(s.id));
          const isAvailable = isEmployeeAvailable(viewEmpDetail.id);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Profile Card Header */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <img
                  src={viewEmpDetail.avatar_url}
                  alt={viewEmpDetail.name}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4AF37' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC', fontWeight: 700 }}>
                      {viewEmpDetail.name}
                    </h3>
                    <Badge status={viewEmpDetail.is_active ? (isAvailable ? 'available' : 'leave') : 'rejected'} label={viewEmpDetail.is_active ? (isAvailable ? 'Active' : 'On Leave') : 'Disabled'} />
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#D4AF37', fontWeight: 500 }}>
                    {viewEmpDetail.role_title} • {viewEmpDetail.experience_years} Years Experience
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
                    Phone: {viewEmpDetail.phone} • ★ {viewEmpDetail.rating} ({viewEmpDetail.reviews_count} reviews)
                  </p>
                </div>
              </div>

              {/* Verified Financial & Fulfillment Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block' }}>Today's Revenue</span>
                  <strong style={{ fontSize: '1.25rem', color: '#10B981' }}>{formatPrice(empStats.todayRevenue)}</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block' }}>Monthly Revenue</span>
                  <strong style={{ fontSize: '1.25rem', color: '#F3E5AB' }}>{formatPrice(empStats.monthRevenue)}</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block' }}>Total Lifetime Revenue</span>
                  <strong style={{ fontSize: '1.25rem', color: '#38BDF8' }}>{formatPrice(empStats.totalRevenue)}</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block' }}>Total Clients Served</span>
                  <strong style={{ fontSize: '1.25rem', color: '#F8FAFC' }}>{empStats.clientsCount}</strong>
                </div>
              </div>

              {/* Assigned Services List */}
              <div>
                <h4 style={{ fontSize: '0.96rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '8px' }}>
                  Assigned Services ({assignedServices.length})
                </h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {assignedServices.map((s) => (
                    <span key={s.id} style={{ fontSize: '0.78rem', backgroundColor: 'rgba(212, 175, 55, 0.12)', color: '#F3E5AB', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                      {s.name} ({formatPrice(s.price)})
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Services Executed Table */}
              <div>
                <h4 style={{ fontSize: '0.96rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '8px' }}>
                  Recent Completed Jobs ({empRecords.length})
                </h4>
                <div className="table-responsive-wrapper" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ color: '#94A3B8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <th style={{ padding: '8px' }}>Date</th>
                        <th style={{ padding: '8px' }}>Client</th>
                        <th style={{ padding: '8px' }}>Items</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empRecords.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '8px', color: '#94A3B8' }}>{formatDateTime(r.completed_at)}</td>
                          <td style={{ padding: '8px', color: '#F8FAFC' }}>{r.customer_name}</td>
                          <td style={{ padding: '8px', color: '#CBD5E1' }}>
                            {r.items.map((i) => i.service_name).join(', ')}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#10B981' }}>
                            {formatPrice(r.total_amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <button onClick={() => setViewEmpDetail(null)} className="btn-dark" style={{ padding: '8px 20px' }}>
                  Close Details
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Add / Edit Employee Modal */}
      <Modal
        isOpen={isEmpModalOpen}
        onClose={() => setIsEmpModalOpen(false)}
        maxWidth="2xl"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="#D4AF37" />
            <span className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC' }}>
              {editingEmp ? `Edit Stylist: ${editingEmp.name}` : 'Register Master Stylist'}
            </span>
          </div>
        }
        subtitle="Manage employee contact details, role designation, and assigned skills."
      >
        <form onSubmit={handleSaveEmp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                className="salon-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Role Title *
              </label>
              <input
                type="text"
                className="salon-input"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Master Creative Director"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Phone Number (Direct Call tel:) *
              </label>
              <input
                type="tel"
                className="salon-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919823012345"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Years of Experience *
              </label>
              <input
                type="number"
                min="0"
                className="salon-input"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Specialization *
            </label>
            <input
              type="text"
              className="salon-input"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. Artisan Scissor Craft, Modern Skin Fades & Groom Styling"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Profile Avatar URL
            </label>
            <input
              type="url"
              className="salon-input"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Bio / Experience Summary
            </label>
            <textarea
              className="salon-input"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Stylist background and craftsmanship story..."
            />
          </div>

          {/* Assigned Services Checklist (Prevents duplicates via Set) */}
          <div>
            <label style={{ fontSize: '0.84rem', color: '#F8FAFC', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Assign Capable Services ({assignedServiceIds.length})
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
              {services.map((s) => {
                const isChecked = assignedServiceIds.includes(s.id);
                return (
                  <label
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: isChecked ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isChecked ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      color: isChecked ? '#F3E5AB' : '#CBD5E1',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssignedServiceIds((prev) => Array.from(new Set([...prev, s.id])));
                        } else {
                          setAssignedServiceIds((prev) => prev.filter((id) => id !== s.id));
                        }
                      }}
                    />
                    <span>{s.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <button type="button" onClick={() => setIsEmpModalOpen(false)} className="btn-dark" style={{ padding: '10px 18px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-gold" style={{ padding: '10px 24px', minHeight: '44px' }}>
              <CheckCircle2 size={16} />
              <span>{editingEmp ? 'Save Changes' : 'Register Stylist'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Mark Leave Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarX size={20} color="#F43F5E" />
            <span className="font-serif" style={{ fontSize: '1.35rem', color: '#F8FAFC' }}>
              Mark Leave for {targetLeaveEmp?.name}
            </span>
          </div>
        }
        subtitle="Stylist will be marked unavailable for customer booking requests during this period."
      >
        <form onSubmit={handleSaveLeave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Leave Type *
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
                Full-Day Leave
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
                Half-Day Leave
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
              placeholder="e.g. Personal emergency, family event, medical checkup..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="btn-dark" style={{ padding: '10px 18px' }}>
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 22px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Approve & Mark Leave
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
