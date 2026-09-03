import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { StatCard } from '../common/StatCard';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Scissors,
  Download,
  Filter,
  CheckCircle2,
  QrCode,
  Banknote,
  PieChart,
  ShieldCheck,
} from 'lucide-react';

export const RevenueReports: React.FC = () => {
  const {
    salonStats,
    employees,
    services,
    serviceRecords,
    getEmployeeStats,
    getServiceStats,
    getPaymentStats,
    activeBranchId,
  } = useSalonData();

  const [selectedEmpFilter, setSelectedEmpFilter] = useState<string>('all');
  const serviceStats = getServiceStats();
  const paymentStats = getPaymentStats();

  const branchRecords = serviceRecords.filter((r) => !r.branch_id || r.branch_id === activeBranchId);
  const branchEmployees = employees.filter((e) => e.branch_id === activeBranchId);

  const filteredRecords =
    selectedEmpFilter === 'all'
      ? branchRecords
      : branchRecords.filter((r) => r.employee_id === selectedEmpFilter);

  const handleExportCSV = () => {
    const headers = ['Record ID', 'Completed At', 'Stylist', 'Client Name', 'Client Phone', 'Items Performed', 'Payment Method', 'Discount (INR)', 'Total Revenue (INR)'];
    const rows = filteredRecords.map((rec) => [
      rec.id,
      rec.completed_at,
      `"${rec.employee_name}"`,
      `"${rec.customer_name}"`,
      `"${rec.customer_phone}"`,
      `"${rec.items.map((i) => i.service_name).join(', ')}"`,
      rec.payment.payment_method,
      rec.discount,
      rec.total_amount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gurukrupa_revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Audit & Financial Intelligence
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
            Financial & Revenue Engine
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
            Comprehensive revenue analytics derived strictly from immutable completed service and payment records.
          </p>
        </div>

        {/* Filter by employee & Export CSV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="salon-select"
            value={selectedEmpFilter}
            onChange={(e) => setSelectedEmpFilter(e.target.value)}
            style={{ padding: '8px 14px', width: 'auto' }}
          >
            <option value="all">All Stylists & Karigars</option>
            {branchEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <button onClick={handleExportCSV} className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <StatCard
          title="Total Gross Revenue"
          value={formatPrice(salonStats.totalRevenue)}
          icon={<DollarSign size={22} />}
          subtitle="Cumulative salon earnings"
        />
        <StatCard
          title="Today's Collections"
          value={formatPrice(salonStats.todayRevenue)}
          icon={<TrendingUp size={22} />}
          subtitle="Real-time collection"
        />
        <StatCard
          title="Services Executed"
          value={salonStats.completedAppointmentsCount}
          icon={<CheckCircle2 size={22} />}
          subtitle="Jobs fulfilled"
        />
        <StatCard
          title="Avg Revenue / Ticket"
          value={formatPrice(
            salonStats.completedAppointmentsCount > 0
              ? Math.round(salonStats.totalRevenue / salonStats.completedAppointmentsCount)
              : 0
          )}
          icon={<CreditCard size={22} />}
          subtitle="Average ticket value"
        />
      </div>

      {/* Payment Method Distribution Strip */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4DED4',
          borderRadius: '18px',
        }}
      >
        <h3 className="font-serif" style={{ fontSize: '1.3rem', color: '#171717', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={18} color="#C9A227" />
          <span>Payment Channel Breakdown</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {paymentStats.map((p) => (
            <div
              key={p.method}
              style={{
                backgroundColor: '#F1EDE6',
                border: '1px solid #E4DED4',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.78rem', color: '#6F6A62', textTransform: 'uppercase', fontWeight: 600 }}>
                  {p.method} ({p.percentage}%)
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#171717', marginTop: '2px' }}>
                  {formatPrice(p.amount)}
                </div>
              </div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4DED4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {p.method === 'UPI' && <QrCode size={18} color="#2B6CB0" />}
                {p.method === 'Cash' && <Banknote size={18} color="#16845B" />}
                {p.method === 'Card' && <CreditCard size={18} color="#B7791F" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stylists Revenue Leaderboard */}
      <div className="glass-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4' }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#171717', fontWeight: 600, marginBottom: '6px' }}>
          Stylist Earnings & Performance Matrix
        </h3>
        <p style={{ fontSize: '0.86rem', color: '#6F6A62', marginBottom: '20px' }}>
          Exact revenue generated per craftsman calculated strictly from completed client service invoices.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {branchEmployees.map((emp) => {
            const stats = getEmployeeStats(emp.id);
            return (
              <div
                key={emp.id}
                style={{
                  backgroundColor: '#F1EDE6',
                  border: '1px solid #E4DED4',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={emp.avatar_url}
                    alt={emp.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #C9A227' }}
                  />
                  <div>
                    <h4 className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 600 }}>
                      {emp.name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: '#C9A227', fontWeight: 600 }}>{emp.role_title}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E4DED4', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: '#6F6A62' }}>Completed Jobs:</span>
                  <strong style={{ color: '#171717' }}>{stats.completedCount}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: '#6F6A62' }}>Clients Served:</span>
                  <strong style={{ color: '#171717' }}>{stats.clientsCount}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.94rem', fontWeight: 700, borderTop: '1px solid #E4DED4', paddingTop: '8px' }}>
                  <span style={{ color: '#6F6A62' }}>Total Revenue:</span>
                  <span style={{ color: '#16845B' }}>{formatPrice(stats.totalRevenue)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Revenue Services Table */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4' }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#171717', fontWeight: 600, marginBottom: '6px' }}>
          Most Popular & Highest Grossing Services
        </h3>
        <p style={{ fontSize: '0.86rem', color: '#6F6A62', marginBottom: '16px' }}>
          Ranked by revenue contribution across all branches.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E4DED4', color: '#6F6A62', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 12px' }}>Service Discipline</th>
              <th style={{ padding: '10px 12px' }}>Unit Price</th>
              <th style={{ padding: '10px 12px' }}>Times Performed</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Gross Revenue</th>
            </tr>
          </thead>
          <tbody>
            {serviceStats.map((s) => (
              <tr key={s.serviceId} style={{ borderBottom: '1px solid #E4DED4', fontSize: '0.88rem' }}>
                <td style={{ padding: '12px', color: '#171717', fontWeight: 600 }}>{s.serviceName}</td>
                <td style={{ padding: '12px', color: '#9A7B1C', fontWeight: 600 }}>{formatPrice(Math.round(s.revenue / (s.count || 1)))}</td>
                <td style={{ padding: '12px', color: '#171717' }}>{s.count} jobs</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#16845B' }}>
                  {formatPrice(s.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Complete Itemized Transaction Logs */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4' }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#171717', fontWeight: 600, marginBottom: '6px' }}>
          Complete Itemized Service Transaction Audit ({filteredRecords.length})
        </h3>
        <p style={{ fontSize: '0.86rem', color: '#6F6A62', marginBottom: '16px' }}>
          Full ledger of billing events, payment channels, and net revenue collections.
        </p>

        {filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#6F6A62' }}>
            No transaction logs matching current filter settings.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E4DED4', color: '#6F6A62', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Client</th>
                <th style={{ padding: '10px 12px' }}>Services Performed</th>
                <th style={{ padding: '10px 12px' }}>Stylist</th>
                <th style={{ padding: '10px 12px' }}>Payment Method</th>
                <th style={{ padding: '10px 12px' }}>Timestamp</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec.id} style={{ borderBottom: '1px solid #E4DED4', fontSize: '0.86rem' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ color: '#171717', fontWeight: 600 }}>{rec.customer_name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#6F6A62' }}>{rec.customer_phone}</div>
                  </td>
                  <td style={{ padding: '12px', color: '#171717' }}>
                    {rec.items.map((i) => i.service_name).join(', ')}
                  </td>
                  <td style={{ padding: '12px', color: '#C9A227', fontWeight: 600 }}>
                    {rec.employee_name || 'Stylist'}
                  </td>
                  <td style={{ padding: '12px', textTransform: 'uppercase', fontSize: '0.78rem', color: '#171717', fontWeight: 500 }}>
                    {rec.payment.payment_method}
                  </td>
                  <td style={{ padding: '12px', color: '#6F6A62', fontSize: '0.78rem' }}>
                    {formatDateTime(rec.completed_at)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#16845B' }}>
                    {formatPrice(rec.total_amount)}
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
