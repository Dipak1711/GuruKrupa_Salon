import React from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import { Users, Phone, CalendarCheck, DollarSign, Sparkles } from 'lucide-react';

export const CustomerManager: React.FC = () => {
  const { appointments, serviceRecords } = useSalonData();

  // Aggregate customer database
  const customerMap: Record<
    string,
    {
      name: string;
      phone: string;
      appointmentsCount: number;
      completedJobsCount: number;
      totalSpent: number;
      lastVisit: string;
    }
  > = {};

  appointments.forEach((apt) => {
    const key = apt.customer_phone || apt.customer_name;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: apt.customer_name,
        phone: apt.customer_phone,
        appointmentsCount: 0,
        completedJobsCount: 0,
        totalSpent: 0,
        lastVisit: apt.created_at,
      };
    }
    customerMap[key].appointmentsCount += 1;
  });

  serviceRecords.forEach((rec) => {
    const key = rec.customer_phone || rec.customer_name;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: rec.customer_name,
        phone: rec.customer_phone,
        appointmentsCount: 0,
        completedJobsCount: 0,
        totalSpent: 0,
        lastVisit: rec.completed_at,
      };
    }
    customerMap[key].completedJobsCount += 1;
    customerMap[key].totalSpent += rec.total_amount;
  });

  const customerList = Object.values(customerMap);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Client Relationship Registry
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
          Customers Directory ({customerList.length})
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
          Registered clients and walk-in visitors with aggregated lifetime spend and visit counts.
        </p>
      </div>

      {/* Customers Table */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        {customerList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
            No customer records recorded yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Client</th>
                <th style={{ padding: '12px' }}>Phone Number</th>
                <th style={{ padding: '12px' }}>Bookings Requested</th>
                <th style={{ padding: '12px' }}>Completed Jobs</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Total Lifetime Spend</th>
              </tr>
            </thead>
            <tbody>
              {customerList.map((client, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.88rem' }}>
                  <td style={{ padding: '14px', color: '#F8FAFC', fontWeight: 600 }}>
                    {client.name}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <a
                      href={`tel:${client.phone}`}
                      style={{ color: '#38BDF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Phone size={13} />
                      <span>{client.phone}</span>
                    </a>
                  </td>
                  <td style={{ padding: '14px', color: '#CBD5E1' }}>
                    {client.appointmentsCount} requests
                  </td>
                  <td style={{ padding: '14px', color: '#F3E5AB' }}>
                    {client.completedJobsCount} services
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, color: '#10B981', fontSize: '1rem' }}>
                    {formatPrice(client.totalSpent)}
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
