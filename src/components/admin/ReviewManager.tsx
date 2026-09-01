import React from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { formatDate } from '../../utils/dates';
import { Star, MessageSquare } from 'lucide-react';

export const ReviewManager: React.FC = () => {
  const { reviews } = useSalonData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Client Sentiment & Feedback
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
          Customer Reviews & Testimonials ({reviews.length})
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
          Real feedback from clients regarding master stylists, grooming quality, and salon ambiance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {reviews.map((rev) => (
          <div key={rev.id} className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      color={i < rev.rating ? '#F59E0B' : '#64748B'}
                      fill={i < rev.rating ? '#F59E0B' : 'transparent'}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{formatDate(rev.created_at)}</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#E2E8F0', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '12px' }}>
                "{rev.comment}"
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#F8FAFC', fontWeight: 600 }}>{rev.customer_name}</h4>
              <div style={{ fontSize: '0.8rem', color: '#D4AF37' }}>
                Stylist: {rev.employee_name || 'Salon Staff'} • {rev.service_name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
