import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/dates';
import { User, Phone, Star, Award, Scissors, CalendarX, Sparkles } from 'lucide-react';

export const EmployeeProfile: React.FC = () => {
  const { activeEmployeeId } = useAuth();
  const { employees, employeeLeaves, services, isEmployeeAvailable } = useSalonData();

  const currentEmployee = employees.find((e) => e.id === activeEmployeeId) || employees[0] || {
    id: activeEmployeeId || 'emp-fallback',
    name: 'Master Stylist',
    role_title: 'Master Stylist',
    specialization: 'Hair & Beard Specialist',
    phone: '+91 98230 12345',
    email: 'stylist@gurukrupasalon.com',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews_count: 120,
    bio: 'Master stylist specializing in bespoke grooming & modern scissor craft.',
    is_active: true,
    experience_years: 5,
    assigned_service_ids: [],
    created_at: new Date().toISOString(),
  };
  const isAvailable = isEmployeeAvailable(currentEmployee.id);

  const myLeaves = employeeLeaves.filter((l) => l.employee_id === currentEmployee.id);
  const myServices = services.filter((s) => currentEmployee.assigned_service_ids.includes(s.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '960px', margin: '0 auto' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Stylist Profile & Availability
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
          {currentEmployee.name}
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
          {currentEmployee.role_title} • {currentEmployee.experience_years} Years Master Experience
        </p>
      </div>

      {/* Main Profile Card */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <img
          src={currentEmployee.avatar_url}
          alt={currentEmployee.name}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: isAvailable ? '3px solid #D4AF37' : '3px solid #F43F5E',
          }}
        />

        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC', fontWeight: 600 }}>
              {currentEmployee.name}
            </h3>
            {isAvailable ? (
              <Badge status="available" label="Available for Bookings" />
            ) : (
              <Badge status="leave" label="Currently on Approved Leave" />
            )}
          </div>

          <p style={{ fontSize: '0.88rem', color: '#CBD5E1', marginBottom: '12px', lineHeight: 1.5 }}>
            {currentEmployee.bio}
          </p>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.84rem', color: '#94A3B8', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="#D4AF37" />
              <span>Direct Phone: <strong style={{ color: '#F8FAFC' }}>{currentEmployee.phone}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <span>Rating: <strong style={{ color: '#F8FAFC' }}>{currentEmployee.rating}</strong> ({currentEmployee.reviews_count} reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={14} color="#D4AF37" />
              <span>Specialty: <strong style={{ color: '#F3E5AB' }}>{currentEmployee.specialization}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Schedule & Status History */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3
          className="font-serif"
          style={{
            fontSize: '1.35rem',
            color: '#F8FAFC',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CalendarX size={18} color="#D4AF37" />
          <span>My Leave Records & Schedule</span>
        </h3>

        {myLeaves.length === 0 ? (
          <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
            No scheduled or historical leaves recorded.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myLeaves.map((leave) => (
              <div
                key={leave.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.94rem', fontWeight: 600, color: '#F8FAFC' }}>
                      {formatDate(leave.start_date)} {leave.start_date !== leave.end_date && `to ${formatDate(leave.end_date)}`}
                    </span>
                    <Badge status={leave.leave_type === 'full_day' ? 'full_day' : 'half_day'} label={leave.leave_type === 'full_day' ? 'Full-Day Leave' : 'Half-Day Leave'} size="sm" />
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                    <strong>Reason:</strong> {leave.reason}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: leave.status === 'approved' ? '#10B981' : '#F59E0B',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    Status: {leave.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services this Stylist can perform */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3
          className="font-serif"
          style={{
            fontSize: '1.35rem',
            color: '#F8FAFC',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Scissors size={18} color="#D4AF37" />
          <span>Assigned Services & Skills ({myServices.length})</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {myServices.map((srv) => (
            <div
              key={srv.id}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <img
                src={srv.images[0]}
                alt={srv.name}
                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '0.92rem', color: '#F8FAFC', fontWeight: 600 }}>{srv.name}</h4>
                <span style={{ fontSize: '0.8rem', color: '#D4AF37' }}>Fee: ₹{srv.price} • {srv.duration_mins}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
