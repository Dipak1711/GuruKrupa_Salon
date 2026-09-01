import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { StatCard } from '../common/StatCard';
import { CompleteServiceModal } from './CompleteServiceModal';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  PlusCircle,
  Users,
  Scissors,
} from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigateToView?: (view: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = () => {
  const { activeEmployeeId } = useAuth();
  const { employees, serviceRecords, getEmployeeStats } = useSalonData();

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

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

  const stats = getEmployeeStats(activeEmployeeId);

  // Recent completed work by this stylist
  const stylistRecords = serviceRecords.filter((r) => r.employee_id === activeEmployeeId).slice(0, 5);

  const handleOpenWalkIn = () => {
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
          <button onClick={handleOpenWalkIn} className="btn-gold" style={{ padding: '11px 22px', minHeight: '44px' }}>
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
        />
        <StatCard
          title="This Month Revenue"
          value={formatPrice(stats.monthRevenue)}
          icon={<TrendingUp size={22} />}
          subtitle="Month to date"
        />
        <StatCard
          title="Clients Served"
          value={stats.clientsCount}
          icon={<Users size={22} />}
          subtitle="Unique clients"
        />
        <StatCard
          title="Completed Services"
          value={stats.completedCount}
          icon={<CheckCircle2 size={22} />}
          subtitle="Lifetime executed"
        />
      </div>

      {/* Recent Completed Work & Revenue Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC', fontWeight: 600 }}>
          Recent Completed Services & Revenue
        </h3>

        {stylistRecords.length === 0 ? (
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
            No recent completed service records found. Use "Add Walk-in Service" to record client billing.
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
                      Walk-in Billing
                    </span>
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

      {/* Walk-In Complete Service Modal */}
      <CompleteServiceModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
        }}
        appointment={null}
        employeeId={activeEmployeeId}
      />
    </div>
  );
};
