import React from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import {
  DollarSign,
  TrendingUp,
  CalendarCheck,
  Users,
  Scissors,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

interface AdminDashboardProps {
  onNavigateToView?: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToView }) => {
  const { salonStats, appointments, employees, serviceRecords, getEmployeeStats, getPaymentStats } =
    useSalonData();

  const paymentStats = getPaymentStats();

  // Generate chart data for revenue by day
  const dailyChartData = [
    { day: 'Mon', revenue: 4200 },
    { day: 'Tue', revenue: 5800 },
    { day: 'Wed', revenue: 6400 },
    { day: 'Thu', revenue: 5200 },
    { day: 'Fri', revenue: 8900 },
    { day: 'Sat', revenue: 14200 },
    { day: 'Sun', revenue: salonStats.todayRevenue || 12500 },
  ];

  // Employee performance ranking
  const employeeRanking = employees
    .filter((e) => e.is_active)
    .map((emp) => {
      const stats = getEmployeeStats(emp.id);
      return {
        id: emp.id,
        name: emp.name,
        avatar_url: emp.avatar_url,
        revenue: stats.totalRevenue,
        completed: stats.completedCount,
        rating: emp.rating,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const COLORS = ['#D4AF37', '#10B981', '#38BDF8', '#F59E0B'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div>
        <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Executive Overview
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
          Salon Operations & Revenue
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
          Live metrics, appointment queue health, employee performance, and revenue trends.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
        }}
      >
        <StatCard
          title="Today's Revenue"
          value={formatPrice(salonStats.todayRevenue)}
          icon={<DollarSign size={22} />}
          subtitle="Real-time collection"
          trend="+18% vs avg"
          trendPositive
        />
        <StatCard
          title="Total Salon Revenue"
          value={formatPrice(salonStats.totalRevenue)}
          icon={<TrendingUp size={22} />}
          subtitle="All completed services"
        />
        <StatCard
          title="Today's Bookings"
          value={salonStats.todayAppointmentsCount}
          icon={<CalendarCheck size={22} />}
          subtitle={`${salonStats.pendingAppointmentsCount} pending review`}
        />
        <StatCard
          title="Total Customers"
          value={salonStats.totalCustomers}
          icon={<Users size={22} />}
          subtitle="Registered & walk-ins"
        />
        <StatCard
          title="Active Master Stylists"
          value={salonStats.totalEmployees}
          icon={<Scissors size={22} />}
          subtitle="Staff available"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Revenue Trends Area Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 600 }}>
                Weekly Revenue Trend
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>7-day revenue performance</span>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F3E5AB' }}>
              {formatPrice(salonStats.totalRevenue)}
            </span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyChartData}>
                <defs>
                  <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value: any) => [formatPrice(Number(value)), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#12151D',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} fill="url(#goldArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '6px' }}>
            Payment Method Split
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '18px' }}>
            UPI vs. Cash vs. Card collections
          </span>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ width: '160px', height: '160px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStats}
                    dataKey="amount"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {paymentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatPrice(Number(val)), 'Amount']}
                    contentStyle={{ backgroundColor: '#12151D', borderRadius: '8px', border: '1px solid #D4AF37' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '180px' }}>
              {paymentStats.map((p, idx) => (
                <div key={p.method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span style={{ color: '#E2E8F0' }}>{p.method} ({p.percentage}%)</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#F3E5AB' }}>{formatPrice(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stylist Performance Leaderboard */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.35rem', color: '#F8FAFC', fontWeight: 600 }}>
              Master Stylist Performance Leaderboard
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              Revenue generated and clients served by each craftsman
            </span>
          </div>

          {onNavigateToView && (
            <button onClick={() => onNavigateToView('reports')} className="btn-gold-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              Detailed Reports
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {employeeRanking.map((emp, index) => (
            <div
              key={emp.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={emp.avatar_url}
                  alt={emp.name}
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #D4AF37' }}
                />
                {index === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: '#D4AF37',
                      color: '#0D0F14',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                    }}
                  >
                    👑
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', color: '#F8FAFC', fontWeight: 600 }}>{emp.name}</h4>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{emp.completed} Services Completed</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10B981' }}>
                  {formatPrice(emp.revenue)}
                </div>
                <span style={{ fontSize: '0.76rem', color: '#F59E0B' }}>★ {emp.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="font-serif" style={{ fontSize: '1.35rem', color: '#F8FAFC', fontWeight: 600 }}>
            Recent Salon Booking Requests
          </h3>

          {onNavigateToView && (
            <button onClick={() => onNavigateToView('appointments')} className="btn-gold-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              Manage All Appointments
            </button>
          )}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 12px' }}>Status</th>
              <th style={{ padding: '10px 12px' }}>Client</th>
              <th style={{ padding: '10px 12px' }}>Service</th>
              <th style={{ padding: '10px 12px' }}>Stylist</th>
              <th style={{ padding: '10px 12px' }}>Price</th>
              <th style={{ padding: '10px 12px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {appointments.slice(0, 6).map((apt) => (
              <tr key={apt.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.86rem' }}>
                <td style={{ padding: '12px' }}>
                  <Badge status={apt.status} size="sm" />
                </td>
                <td style={{ padding: '12px', color: '#F8FAFC', fontWeight: 500 }}>
                  {apt.customer_name}
                </td>
                <td style={{ padding: '12px', color: '#CBD5E1' }}>
                  {apt.service_name}
                </td>
                <td style={{ padding: '12px', color: '#F3E5AB' }}>
                  {apt.employee_name}
                </td>
                <td style={{ padding: '12px', fontWeight: 600, color: '#10B981' }}>
                  {formatPrice(apt.service_price || 0)}
                </td>
                <td style={{ padding: '12px', color: '#94A3B8', fontSize: '0.78rem' }}>
                  {formatDateTime(apt.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
