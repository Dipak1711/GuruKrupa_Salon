import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { StatCard } from '../common/StatCard';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import { DollarSign, TrendingUp, Calendar, CreditCard, Banknote, QrCode } from 'lucide-react';

export const EmployeeEarnings: React.FC = () => {
  const { activeEmployeeId } = useAuth();
  const { serviceRecords, getEmployeeStats } = useSalonData();

  const stats = getEmployeeStats(activeEmployeeId);
  const myRecords = serviceRecords.filter((r) => r.employee_id === activeEmployeeId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Financial Summary
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
          My Stylist Earnings & Revenue
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
          Real-time calculation derived automatically from completed client services and valid payments.
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <StatCard
          title="Today's Total"
          value={formatPrice(stats.todayRevenue)}
          icon={<DollarSign size={22} />}
          subtitle="Services closed today"
        />
        <StatCard
          title="This Month Total"
          value={formatPrice(stats.monthRevenue)}
          icon={<TrendingUp size={22} />}
          subtitle="Cumulative month earnings"
        />
        <StatCard
          title="Lifetime Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={<DollarSign size={22} />}
          subtitle={`Across ${stats.completedCount} completed services`}
        />
        <StatCard
          title="Unique Clients Served"
          value={stats.clientsCount}
          icon={<Calendar size={22} />}
          subtitle="Regulars & walk-ins"
        />
      </div>

      {/* Service Record Items Audit Table */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4' }}>
        <h3 className="font-serif" style={{ fontSize: '1.35rem', color: '#171717', fontWeight: 600, marginBottom: '16px' }}>
          Itemized Service Records & Price Breakdown
        </h3>

        {myRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#6F6A62' }}>
            No completed service records logged yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E4DED4', color: '#6F6A62', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Record ID / Date</th>
                <th style={{ padding: '12px 14px' }}>Client</th>
                <th style={{ padding: '12px 14px' }}>Services Performed (Snapshot)</th>
                <th style={{ padding: '12px 14px' }}>Payment</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {myRecords.map((rec) => (
                <tr
                  key={rec.id}
                  style={{ borderBottom: '1px solid #E4DED4', fontSize: '0.88rem' }}
                >
                  <td style={{ padding: '14px' }}>
                    <div style={{ color: '#171717', fontWeight: 600 }}>#{rec.id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: '0.76rem', color: '#6F6A62' }}>{formatDateTime(rec.completed_at)}</div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div style={{ color: '#C9A227', fontWeight: 600 }}>{rec.customer_name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#6F6A62' }}>{rec.customer_phone}</div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {rec.items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                          <span style={{ color: '#171717' }}>{item.service_name}</span>
                          <span style={{ color: '#6F6A62', marginLeft: '12px' }}>{formatPrice(item.unit_price)}</span>
                        </div>
                      ))}
                      {rec.discount > 0 && (
                        <div style={{ fontSize: '0.78rem', color: '#16845B', fontWeight: 600 }}>
                          Discount Applied: -{formatPrice(rec.discount)}
                        </div>
                      )}
                    </div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#F1EDE6',
                        border: '1px solid #E4DED4',
                        fontSize: '0.8rem',
                        color: '#171717',
                        fontWeight: 500,
                      }}
                    >
                      {rec.payment.payment_method === 'UPI' && <QrCode size={13} color="#2B6CB0" />}
                      {rec.payment.payment_method === 'Cash' && <Banknote size={13} color="#16845B" />}
                      {rec.payment.payment_method === 'Card' && <CreditCard size={13} color="#B7791F" />}
                      <span>{rec.payment.payment_method}</span>
                    </span>
                  </td>

                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#16845B' }}>
                      {formatPrice(rec.total_amount)}
                    </span>
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
