import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';

export const EmployeeClients: React.FC = () => {
  const { activeEmployeeId } = useAuth();
  const { serviceRecords } = useSalonData();

  // Aggregate clients served by this stylist
  const clientMap: Record<
    string,
    {
      name: string;
      phone: string;
      totalVisits: number;
      totalSpent: number;
      lastVisit: string;
      services: string[];
    }
  > = {};

  const myRecords = serviceRecords.filter((r) => r.employee_id === activeEmployeeId);

  myRecords.forEach((rec) => {
    // Skip disassociated/deleted customer entries
    if (!rec.customer_name && (!rec.customer_phone || rec.customer_phone === 'N/A')) return;

    const rawName = (rec.customer_name || 'Walk-in Client').trim();
    const rawPhone = (rec.customer_phone || 'N/A').trim();

    const key = rawPhone && rawPhone !== 'N/A' ? rawPhone : rawName;
    if (!key) return;

    if (!clientMap[key]) {
      clientMap[key] = {
        name: rawName,
        phone: rawPhone,
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: rec.completed_at,
        services: [],
      };
    }
    clientMap[key].totalVisits += 1;
    clientMap[key].totalSpent += rec.total_amount;
    rec.items.forEach((item) => {
      if (item.service_name && !clientMap[key].services.includes(item.service_name)) {
        clientMap[key].services.push(item.service_name);
      }
    });
  });

  const clientsList = Object.values(clientMap);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Client Portfolio
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
          My Stylist Clients ({clientsList.length})
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
          Directory of regular and walk-in clients serviced by you with visit history and total spend.
        </p>
      </div>

      {clientsList.length === 0 ? (
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: '#6F6A62', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4' }}>
          No client records registered yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {clientsList.map((client, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4DED4',
                borderRadius: '16px',
              }}
            >
              {/* Row 1: Client Info, Visits, Total Spend, Form Filled / Last Visit Date & Time */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  borderBottom: '1px solid #E4DED4',
                  paddingBottom: '14px',
                }}
              >
                {/* 1. Client Name & Phone */}
                <div style={{ minWidth: '180px' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 600, margin: 0 }}>
                    {client.name}
                  </h3>
                  <span style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginTop: '2px' }}>
                    {client.phone}
                  </span>
                </div>

                {/* 2. Visits */}
                <div>
                  <span style={{ color: '#6F6A62', fontSize: '0.76rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                    Visits
                  </span>
                  <strong style={{ fontSize: '1rem', color: '#171717' }}>{client.totalVisits}</strong>
                </div>

                {/* 3. Total Spend */}
                <div>
                  <span style={{ color: '#6F6A62', fontSize: '0.76rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                    Total Spend
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: '#16845B' }}>{formatPrice(client.totalSpent)}</strong>
                </div>

                {/* 4. Form Filled / Last Visit Date & Time */}
                <div>
                  <span style={{ color: '#6F6A62', fontSize: '0.76rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                    Form Filled / Time
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#171717', fontWeight: 500 }}>
                    {formatDateTime(client.lastVisit)}
                  </span>
                </div>
              </div>

              {/* Row 2: Services Taken */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: '#6F6A62', fontWeight: 600 }}>
                  Services Taken:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {client.services.map((srv, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '0.76rem',
                        backgroundColor: '#F1EDE6',
                        border: '1px solid #E4DED4',
                        color: '#9A7B1C',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
