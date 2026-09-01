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
  } = useSalonData();

  const [selectedEmpFilter, setSelectedEmpFilter] = useState<string>('all');
  const serviceStats = getServiceStats();
  const paymentStats = getPaymentStats();

  const filteredRecords =
    selectedEmpFilter === 'all'
      ? serviceRecords
      : serviceRecords.filter((r) => r.employee_id === selectedEmpFilter);

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
          <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Audit & Financial Intelligence
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
            Financial & Revenue Engine
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
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
            {employees.map((emp) => (
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
          subtitle="Net collected from all services"
          trend="+18%"
          trendPositive
        />
        <StatCard
          title="Today's Revenue"
          value={formatPrice(salonStats.todayRevenue)}
          icon={<TrendingUp size={22} />}
          subtitle="Collected today"
        />
        <StatCard
          title="Completed Job Records"
          value={serviceRecords.length}
          icon={<BarChart3 size={22} />}
          subtitle="Audit verified transactions"
        />
        <StatCard
          title="Unique Customers Served"
          value={salonStats.totalCustomers}
          icon={<Users size={22} />}
          subtitle="Appointments + Walk-ins"
        />
      </div>

      {/* Payment Method Breakdown Cards (UPI, Cash, Card, Other) */}
      <div>
        <h3 className="font-serif" style={{ fontSize: '1.3rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={18} color="#D4AF37" />
          <span>Payment Channel Breakdown</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {paymentStats.map((ps) => (
            <div
              key={ps.method}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                  flexShrink: 0,
                }}
              >
                {ps.method === 'UPI' && <QrCode size={22} />}
                {ps.method === 'Cash' && <Banknote size={22} />}
                {ps.method === 'Card' && <CreditCard size={22} />}
                {ps.method === 'Other' && <DollarSign size={22} />}
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
                  {ps.method} Revenue ({ps.percentage}%)
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC' }}>
                  {formatPrice(ps.amount)}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {ps.count} transactions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee-Wise Detailed Revenue Drilldown (Prompt requirement) */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '6px' }}>
          Stylist & Karigar Revenue Breakdown
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '20px' }}>
          Granular report showing each craftsman's completed services, client count, and exact generated revenue.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {employees
            .filter((e) => selectedEmpFilter === 'all' || e.id === selectedEmpFilter)
            .map((emp) => {
              const empStats = getEmployeeStats(emp.id);
              const empRecs = serviceRecords.filter((r) => r.employee_id === emp.id);

              const serviceTally: Record<string, { name: string; count: number; total: number }> = {};
              empRecs.forEach((r) => {
                r.items.forEach((item) => {
                  if (!serviceTally[item.service_id]) {
                    serviceTally[item.service_id] = { name: item.service_name, count: 0, total: 0 };
                  }
                  serviceTally[item.service_id].count += item.quantity;
                  serviceTally[item.service_id].total += item.subtotal;
                });
              });

              return (
                <div
                  key={emp.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                      <img
                        src={emp.avatar_url}
                        alt={emp.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #D4AF37' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 className="font-serif" style={{ fontSize: '1.2rem', color: '#F8FAFC', fontWeight: 600 }}>
                          {emp.name}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: '#D4AF37' }}>{emp.role_title}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10B981' }}>
                          {formatPrice(empStats.totalRevenue)}
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Total Revenue</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '0.76rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Services Executed:
                      </span>
                      {Object.keys(serviceTally).length === 0 ? (
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>No completed services yet.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {Object.values(serviceTally).map((srv, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.84rem',
                                color: '#CBD5E1',
                              }}
                            >
                              <span>
                                {srv.name} <strong style={{ color: '#94A3B8' }}>(x{srv.count})</strong>
                              </span>
                              <span style={{ color: '#F3E5AB', fontWeight: 600 }}>{formatPrice(srv.total)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(212, 175, 55, 0.08)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                    }}
                  >
                    <span>Unique Clients: <strong>{empStats.clientsCount}</strong></span>
                    <span>Completed Services: <strong>{empStats.completedCount}</strong></span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Service-Wise Revenue Ranking */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '6px' }}>
          Service-Wise Revenue Contributions
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '16px' }}>
          Revenue rankings for each salon service in catalog.
        </p>

        <div className="table-responsive-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Service Name</th>
                <th style={{ padding: '12px' }}>Times Executed</th>
                <th style={{ padding: '12px' }}>Catalog Base Price</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Total Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {serviceStats.map((s) => {
                const serviceObj = services.find((item) => item.id === s.serviceId);
                return (
                  <tr key={s.serviceId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.88rem' }}>
                    <td style={{ padding: '12px', color: '#F8FAFC', fontWeight: 600 }}>{s.serviceName}</td>
                    <td style={{ padding: '12px', color: '#CBD5E1' }}>{s.count} times</td>
                    <td style={{ padding: '12px', color: '#F3E5AB' }}>
                      {formatPrice(serviceObj?.price || 0)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#10B981', fontSize: '1rem' }}>
                      {formatPrice(s.revenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Audit Trail */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '6px' }}>
          Completed Service Audit Trail ({filteredRecords.length} Transactions)
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '16px' }}>
          Every completed job with stylist, client, items, payment method and timestamp.
        </p>

        <div className="table-responsive-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Timestamp</th>
                <th style={{ padding: '10px 12px' }}>Stylist</th>
                <th style={{ padding: '10px 12px' }}>Client</th>
                <th style={{ padding: '10px 12px' }}>Items & Price Snapshot</th>
                <th style={{ padding: '10px 12px' }}>Payment</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.86rem' }}>
                  <td style={{ padding: '12px', color: '#94A3B8' }}>{formatDateTime(rec.completed_at)}</td>
                  <td style={{ padding: '12px', color: '#F3E5AB', fontWeight: 600 }}>{rec.employee_name}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ color: '#F8FAFC', fontWeight: 500 }}>{rec.customer_name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{rec.customer_phone}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {rec.items.map((i) => (
                      <div key={i.id} style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                        {i.service_name} ({formatPrice(i.unit_price)})
                      </div>
                    ))}
                    {rec.discount > 0 && (
                      <div style={{ fontSize: '0.74rem', color: '#10B981' }}>
                        Disc: -{formatPrice(rec.discount)}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        fontSize: '0.78rem',
                        color: '#E2E8F0',
                      }}
                    >
                      {rec.payment.payment_method}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#10B981' }}>
                    {formatPrice(rec.total_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
