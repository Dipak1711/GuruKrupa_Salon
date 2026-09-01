import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSalonData } from '../../context/SalonDataContext';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import { Users, Phone, Calendar, DollarSign, Sparkles } from 'lucide-react';

export const EmployeeClients: React.FC = () => {
  const { activeEmployeeId } = useAuth();
  const { serviceRecords, appointments } = useSalonData();

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
    const key = rec.customer_phone || rec.customer_name;
    if (!clientMap[key]) {
      clientMap[key] = {
        name: rec.customer_name,
        phone: rec.customer_phone,
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: rec.completed_at,
        services: [],
      };
    }
    clientMap[key].totalVisits += 1;
    clientMap[key].totalSpent += rec.total_amount;
    rec.items.forEach((item) => {
      if (!clientMap[key].services.includes(item.service_name)) {
        clientMap[key].services.push(item.service_name);
      }
    });
  });

  const clientsList = Object.values(clientMap);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Client Portfolio
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
          My Stylist Clients
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
          Directory of regular and walk-in clients serviced by you with visit history and total spend.
        </p>
      </div>

      {clientsList.length === 0 ? (
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
          No client records registered yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {clientsList.map((client, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 600 }}>
                      {client.name}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{client.phone}</span>
                  </div>

                  <a
                    href={`tel:${client.phone}`}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: '#F3E5AB',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={13} color="#D4AF37" />
                    <span>Call</span>
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem', color: '#CBD5E1', margin: '12px 0' }}>
                  <div>
                    <span style={{ color: '#94A3B8', fontSize: '0.76rem', display: 'block' }}>Visits</span>
                    <strong>{client.totalVisits}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', fontSize: '0.76rem', display: 'block' }}>Total Spend</span>
                    <strong style={{ color: '#10B981' }}>{formatPrice(client.totalSpent)}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', fontSize: '0.76rem', display: 'block' }}>Last Visit</span>
                    <span>{formatDateTime(client.lastVisit).split(',')[0]}</span>
                  </div>
                </div>

                {/* Frequently requested services */}
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                    Services Taken:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {client.services.map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: '0.72rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: '#F3E5AB',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
