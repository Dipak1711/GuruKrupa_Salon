import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dates';
import { Star, CheckCircle2, XCircle, Trash2, MessageSquare, Filter } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ReviewManager: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview } = useSalonData();
  const { success, info } = useToast();

  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const filteredReviews =
    statusFilter === 'all' ? reviews : reviews.filter((r) => r.status === statusFilter || (!r.status && statusFilter === 'approved'));

  const handleApprove = (id: string, name: string) => {
    updateReviewStatus(id, 'approved');
    success('Review Approved', `Review from ${name} is now publicly visible.`);
  };

  const handleReject = (id: string, name: string) => {
    updateReviewStatus(id, 'rejected');
    info('Review Rejected', `Review from ${name} marked as rejected.`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this review permanently?')) {
      deleteReview(id);
      success('Review Deleted', 'Review removed from database.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Client Sentiment & Feedback Moderation
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
            Customer Reviews & Testimonials ({reviews.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
            Moderate customer feedback. Only approved reviews appear on customer pages.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'approved', 'pending', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: statusFilter === st ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: statusFilter === st ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: statusFilter === st ? '#F3E5AB' : '#94A3B8',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Review Cards Grid */}
      {filteredReviews.length === 0 ? (
        <div className="glass-card" style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
          <MessageSquare size={32} color="#D4AF37" style={{ marginBottom: '10px' }} />
          <h4 style={{ color: '#F8FAFC', fontSize: '1.1rem', marginBottom: '4px' }}>No Reviews Found</h4>
          <p style={{ fontSize: '0.86rem' }}>Try clearing filters to see all client testimonials.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                border: rev.status === 'approved' || !rev.status ? '1px solid rgba(212, 175, 55, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        color={i < rev.rating ? '#F59E0B' : '#64748B'}
                        fill={i < rev.rating ? '#F59E0B' : 'transparent'}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{formatDate(rev.created_at)}</span>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#E2E8F0', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '14px' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h4 style={{ fontSize: '0.96rem', color: '#F8FAFC', fontWeight: 600 }}>{rev.customer_name}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#D4AF37', marginTop: '2px' }}>
                      Stylist: {rev.employee_name || 'Salon Staff'} • {rev.service_name}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor:
                        rev.status === 'approved' || !rev.status
                          ? 'rgba(16, 185, 129, 0.12)'
                          : rev.status === 'rejected'
                          ? 'rgba(244, 63, 94, 0.12)'
                          : 'rgba(245, 158, 11, 0.12)',
                      color:
                        rev.status === 'approved' || !rev.status
                          ? '#10B981'
                          : rev.status === 'rejected'
                          ? '#FB7185'
                          : '#F59E0B',
                      textTransform: 'uppercase',
                    }}
                  >
                    {rev.status || 'approved'}
                  </span>
                </div>

                {/* Moderation Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', borderTop: '1px dashed rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(rev.id, rev.customer_name)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve</span>
                    </button>
                  )}

                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => handleReject(rev.id, rev.customer_name)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(244, 63, 94, 0.1)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        color: '#FB7185',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev.id)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#64748B',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
