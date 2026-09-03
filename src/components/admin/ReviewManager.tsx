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
          <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Client Sentiment & Feedback Moderation
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
            Customer Reviews & Testimonials ({reviews.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
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
                border: statusFilter === st ? '1px solid #C9A227' : '1px solid #E4DED4',
                backgroundColor: statusFilter === st ? 'rgba(201, 162, 39, 0.18)' : '#F1EDE6',
                color: statusFilter === st ? '#9A7B1C' : '#6F6A62',
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
        <div className="glass-card" style={{ padding: '36px', textAlign: 'center', color: '#6F6A62', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4' }}>
          <MessageSquare size={32} color="#C9A227" style={{ marginBottom: '10px' }} />
          <h4 style={{ color: '#171717', fontSize: '1.1rem', marginBottom: '4px' }}>No Reviews Found</h4>
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
                backgroundColor: '#FFFFFF',
                border: rev.status === 'approved' || !rev.status ? '1px solid #E4DED4' : '1px solid #E4DED4',
                borderRadius: '18px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        color={i < rev.rating ? '#B7791F' : '#E4DED4'}
                        fill={i < rev.rating ? '#B7791F' : 'transparent'}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#6F6A62' }}>{formatDate(rev.created_at)}</span>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#171717', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '14px' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div>
                <div style={{ borderTop: '1px solid #E4DED4', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h4 style={{ fontSize: '0.96rem', color: '#171717', fontWeight: 600 }}>{rev.customer_name}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#C9A227', marginTop: '2px', fontWeight: 600 }}>
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
                          ? 'rgba(22, 132, 91, 0.12)'
                          : rev.status === 'rejected'
                          ? 'rgba(201, 74, 74, 0.12)'
                          : 'rgba(183, 121, 31, 0.12)',
                      color:
                        rev.status === 'approved' || !rev.status
                          ? '#16845B'
                          : rev.status === 'rejected'
                          ? '#C94A4A'
                          : '#B7791F',
                      textTransform: 'uppercase',
                    }}
                  >
                    {rev.status || 'approved'}
                  </span>
                </div>

                {/* Moderation Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', borderTop: '1px dashed #E4DED4', paddingTop: '12px' }}>
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(rev.id, rev.customer_name)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(22, 132, 91, 0.12)',
                        border: '1px solid rgba(22, 132, 91, 0.3)',
                        color: '#16845B',
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
                        backgroundColor: 'rgba(201, 74, 74, 0.1)',
                        border: '1px solid rgba(201, 74, 74, 0.3)',
                        color: '#C94A4A',
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
                      backgroundColor: '#F1EDE6',
                      border: '1px solid #E4DED4',
                      color: '#6F6A62',
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
