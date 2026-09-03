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

  const handleOpenAddLeave = (emp: Employee) => {
    setTargetLeaveEmp(emp);
    setLeaveType('full_day');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setReason('');
    setIsLeaveModalOpen(true);
  };

  const handleSaveEmp = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEmp) {
      updateEmployee(editingEmp.id, {
        name,
        role_title: roleTitle,
        experience_years: Number(experienceYears),
        specialization,
        phone,
        avatar_url: avatarUrl,
        bio,
        assigned_service_ids: assignedServiceIds,
      });
      success('Employee Updated', `Stylist profile for "${name}" updated.`);
    } else {
      addEmployee({
        branch_id: activeBranchId,
        name,
        role_title: roleTitle,
        experience_years: Number(experienceYears),
        specialization,
        phone,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@gurukrupasalon.com`,
        avatar_url: avatarUrl,
        rating: 4.8,
        reviews_count: 10,
        bio,
        is_active: true,
        assigned_service_ids: assignedServiceIds,
      });
      success('Employee Registered', `Master craftsman "${name}" added to salon roster.`);
    }

    setIsEmpModalOpen(false);
  };

  const handleSaveLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLeaveEmp) return;

    addEmployeeLeave({
      employee_id: targetLeaveEmp.id,
      employee_name: targetLeaveEmp.name,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
      status: 'approved',
    });

    success('Leave Approved', `Leave logged for ${targetLeaveEmp.name} (${startDate} to ${endDate}).`);
    setIsLeaveModalOpen(false);
  };

  const handleToggleActive = (empId: string, empName: string) => {
    toggleEmployeeActive(empId);
    info('Status Updated', `Employee state modified for "${empName}".`);
  };

  const handleServiceCheckboxChange = (srvId: string) => {
    if (assignedServiceIds.includes(srvId)) {
      setAssignedServiceIds(assignedServiceIds.filter((id) => id !== srvId));
    } else {
      setAssignedServiceIds([...assignedServiceIds, srvId]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header & Actions */}
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
          <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Staff & Performance Command Center
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
            Employee Management ({employees.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
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
                backgroundColor: '#FFFFFF',
                border: emp.is_active
                  ? isAvailable
                    ? '1px solid #E4DED4'
                    : '1px dashed #C94A4A'
                  : '1px solid #E4DED4',
                borderRadius: '18px',
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
                          ? '2px solid #C9A227'
                          : '2px solid #C94A4A'
                        : '2px solid #8C857B',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 600 }}>
                        {emp.name}
                      </h3>
                      {!emp.is_active ? (
                        <span style={{ fontSize: '0.7rem', color: '#C94A4A', backgroundColor: 'rgba(201, 74, 74, 0.12)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          Disabled
                        </span>
                      ) : isAvailable ? (
                        <Badge status="available" size="sm" label="Available" />
                      ) : (
                        <Badge status="leave" size="sm" label="On Leave" />
                      )}
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#C9A227', fontWeight: 600 }}>
                      {emp.role_title}
                    </p>

                    <span style={{ fontSize: '0.78rem', color: '#6F6A62' }}>
                      {emp.experience_years} Yrs Exp. • ★ {emp.rating} ({emp.reviews_count})
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#6F6A62', marginBottom: '12px' }}>
                  <strong>Specialization:</strong> {emp.specialization}
                </div>

                {/* Revenue & Service Statistics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    backgroundColor: '#F1EDE6',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    marginBottom: '14px',
                    textAlign: 'center',
                    border: '1px solid #E4DED4',
                  }}
                >
                  <div>
                    <span style={{ color: '#6F6A62', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Total Revenue</span>
                    <strong style={{ color: '#16845B', fontSize: '0.95rem' }}>{formatPrice(empStats.totalRevenue)}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6F6A62', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Clients</span>
                    <strong style={{ fontSize: '0.95rem', color: '#171717' }}>{empStats.clientsCount}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6F6A62', fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Skills</span>
                    <strong style={{ color: '#9A7B1C', fontSize: '0.95rem' }}>{assignedServices.length}</strong>
                  </div>
                </div>

                {/* Assigned Services Badges */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {assignedServices.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      style={{
                        fontSize: '0.72rem',
                        backgroundColor: 'rgba(201, 162, 39, 0.1)',
                        border: '1px solid rgba(201, 162, 39, 0.25)',
                        color: '#9A7B1C',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        fontWeight: 500,
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                  {assignedServices.length > 3 && (
                    <span style={{ fontSize: '0.72rem', color: '#6F6A62' }}>
                      +{assignedServices.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #E4DED4',
                  paddingTop: '14px',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setViewEmpDetail(emp)}
                    className="btn-gold-outline"
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    <BarChart3 size={13} />
                    <span>Stats</span>
                  </button>

                  <button
                    onClick={() => handleOpenAddLeave(emp)}
                    className="btn-gold-outline"
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    <CalendarX size={13} color="#C9A227" />
                    <span>Log Leave</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleToggleActive(emp.id, emp.name)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#F1EDE6',
                      border: '1px solid #E4DED4',
                      color: emp.is_active ? '#6F6A62' : '#16845B',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    {emp.is_active ? 'Disable' : 'Enable'}
                  </button>

                  <button
                    onClick={() => handleOpenEditEmp(emp)}
                    className="btn-gold"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
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

      {/* ------------------------------------------------------------------------- */}
      {/* 1. STYLIST STATS & HISTORY DETAIL MODAL                                   */}
      {/* ------------------------------------------------------------------------- */}
      <Modal
        isOpen={Boolean(viewEmpDetail)}
        onClose={() => setViewEmpDetail(null)}
        maxWidth="xl"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="#C9A227" />
            <span className="font-serif" style={{ fontSize: '1.4rem', color: '#171717' }}>
              Stylist Analytics: {viewEmpDetail?.name}
            </span>
          </div>
        }
        subtitle="Verified live financial performance and completed jobs history."
      >
        {viewEmpDetail && (() => {
          const empStats = getEmployeeStats(viewEmpDetail.id);
          const empRecords = serviceRecords.filter((r) => r.employee_id === viewEmpDetail.id);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Stat Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '14px', backgroundColor: '#F1EDE6', borderRadius: '12px', border: '1px solid #E4DED4' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6F6A62', textTransform: 'uppercase', fontWeight: 600 }}>Lifetime Revenue</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16845B', marginTop: '2px' }}>
                    {formatPrice(empStats.totalRevenue)}
                  </div>
                </div>

                <div style={{ padding: '14px', backgroundColor: '#F1EDE6', borderRadius: '12px', border: '1px solid #E4DED4' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6F6A62', textTransform: 'uppercase', fontWeight: 600 }}>Today's Revenue</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#C9A227', marginTop: '2px' }}>
                    {formatPrice(empStats.todayRevenue)}
                  </div>
                </div>

                <div style={{ padding: '14px', backgroundColor: '#F1EDE6', borderRadius: '12px', border: '1px solid #E4DED4' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6F6A62', textTransform: 'uppercase', fontWeight: 600 }}>Clients Served</span>
                  <strong style={{ fontSize: '1.25rem', color: '#171717', display: 'block', marginTop: '2px' }}>{empStats.clientsCount}</strong>
                </div>
              </div>

              {/* Service Records Table */}
              <div>
                <h4 style={{ fontSize: '0.96rem', color: '#171717', fontWeight: 600, marginBottom: '8px' }}>
                  Recent Completed Jobs ({empRecords.length})
                </h4>

                {empRecords.length === 0 ? (
                  <p style={{ color: '#6F6A62', fontSize: '0.86rem' }}>No completed services recorded for this stylist yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid #E4DED4', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F1EDE6', color: '#6F6A62', borderBottom: '1px solid #E4DED4' }}>
                          <th style={{ padding: '8px 12px' }}>Date</th>
                          <th style={{ padding: '8px 12px' }}>Client</th>
                          <th style={{ padding: '8px 12px' }}>Services</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {empRecords.map((r) => (
                          <tr key={r.id} style={{ borderBottom: '1px solid #E4DED4' }}>
                            <td style={{ padding: '8px 12px', color: '#6F6A62' }}>{formatDateTime(r.completed_at)}</td>
                            <td style={{ padding: '8px 12px', color: '#171717', fontWeight: 600 }}>{r.customer_name}</td>
                            <td style={{ padding: '8px 12px', color: '#6F6A62' }}>{r.items.map((i) => i.service_name).join(', ')}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#16845B' }}>
                              {formatPrice(r.total_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. ADD / EDIT EMPLOYEE MODAL                                              */}
      {/* ------------------------------------------------------------------------- */}
      <Modal
        isOpen={isEmpModalOpen}
        onClose={() => setIsEmpModalOpen(false)}
        maxWidth="lg"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="#C9A227" />
            <span className="font-serif" style={{ fontSize: '1.4rem', color: '#171717' }}>
              {editingEmp ? `Edit Stylist: ${editingEmp.name}` : 'Register New Master Stylist'}
            </span>
          </div>
        }
        subtitle="Manage master craftsman profile details and assign skill qualifications."
      >
        <form onSubmit={handleSaveEmp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Full Name *
              </label>
              <input
                type="text"
                className="salon-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Role / Title *
              </label>
              <input
                type="text"
                className="salon-input"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Master Stylist, Senior Barber..."
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                className="salon-input"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Direct Phone Number *
              </label>
              <input
                type="tel"
                className="salon-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98230 12345"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Specialization *
            </label>
            <input
              type="text"
              className="salon-input"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. Scissor Haircuts & Beard Grooming Specialist"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Avatar Image URL
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
            <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Short Bio / Background
            </label>
            <textarea
              className="salon-input"
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Master craftsman trained in classic grooming..."
            />
          </div>

          {/* Assigned Services Checklist */}
          <div>
            <label style={{ fontSize: '0.84rem', color: '#171717', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Assigned Skill Qualifications ({assignedServiceIds.length} Selected)
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '8px',
                maxHeight: '180px',
                overflowY: 'auto',
                backgroundColor: '#F1EDE6',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #E4DED4',
              }}
            >
              {services.map((srv) => {
                const isChecked = assignedServiceIds.includes(srv.id);
                return (
                  <label
                    key={srv.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      color: isChecked ? '#171717' : '#6F6A62',
                      cursor: 'pointer',
                      fontWeight: isChecked ? 600 : 400,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleServiceCheckboxChange(srv.id)}
                      style={{ accentColor: '#C9A227' }}
                    />
                    <span>{srv.name} (₹{srv.price})</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #E4DED4',
              paddingTop: '16px',
            }}
          >
            <button type="button" onClick={() => setIsEmpModalOpen(false)} className="btn-gold-outline" style={{ padding: '10px 18px' }}>
              Cancel
            </button>

            <button type="submit" className="btn-gold" style={{ padding: '10px 24px' }}>
              <CheckCircle2 size={16} />
              <span>{editingEmp ? 'Save Employee Profile' : 'Register Employee'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------------------- */}
      {/* 3. LOG LEAVE MODAL                                                        */}
      {/* ------------------------------------------------------------------------- */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarX size={20} color="#C9A227" />
            <span className="font-serif" style={{ fontSize: '1.35rem', color: '#171717' }}>
              Log Leave for {targetLeaveEmp?.name}
            </span>
          </div>
        }
        subtitle="Record leave periods to manage availability across branches."
      >
        <form onSubmit={handleSaveLeave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Leave Type *
            </label>
            <select
              className="salon-select"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            >
              <option value="full_day">Full-Day Leave</option>
              <option value="half_day">Half-Day Leave</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
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
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
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
            <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Reason for Leave *
            </label>
            <input
              type="text"
              className="salon-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Personal leave, Family event..."
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #E4DED4',
              paddingTop: '16px',
            }}
          >
            <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="btn-gold-outline" style={{ padding: '10px 18px' }}>
              Cancel
            </button>

            <button type="submit" className="btn-gold" style={{ padding: '10px 22px' }}>
              <CheckCircle2 size={16} />
              <span>Approve & Record Leave</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
