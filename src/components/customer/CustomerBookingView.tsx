import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { Branch, Employee } from '../../types';
import { Phone, MapPin, ArrowLeft, Users, Star, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerBookingViewProps {
  onNavigateHome?: () => void;
}

export const CustomerBookingView: React.FC<CustomerBookingViewProps> = () => {
  const { branches, employees, services } = useSalonData();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Filter active branches
  const activeBranches = branches.filter((b) => b.status === 'active' || !b.status);

  // Get employees for selected branch
  const branchArtists = selectedBranch
    ? employees.filter((e) => e.branch_id === selectedBranch.id && e.is_active !== false)
    : [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      <AnimatePresence mode="wait">
        {!selectedBranch ? (
          /* ========================================================================= */
          /* STEP 1: SELECT BRANCH                                                     */
          /* ========================================================================= */
          <motion.div
            key="branch-selection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  marginBottom: '12px',
                }}
              >
                <Scissors size={14} color="#D4AF37" />
                <span style={{ fontSize: '0.78rem', color: '#F3E5AB', fontWeight: 600, letterSpacing: '0.05em' }}>
                  STEP 1 OF 2
                </span>
              </div>
              <h1 className="font-serif" style={{ fontSize: '2rem', color: '#F8FAFC', fontWeight: 700, marginBottom: '8px' }}>
                Choose Your Salon
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto' }}>
                Select a branch location to view available master artists and connect directly by phone.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {activeBranches.map((branch) => {
                const staffCount = employees.filter(
                  (e) => e.branch_id === branch.id && e.is_active !== false
                ).length;

                return (
                  <motion.div
                    key={branch.id}
                    whileHover={{ y: -4 }}
                    style={{
                      backgroundColor: '#0F1218',
                      borderRadius: '16px',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {/* Branch Image Header */}
                    <div style={{ height: '180px', position: 'relative', overflow: 'hidden', backgroundColor: '#1E293B' }}>
                      <img
                        src={
                          branch.image_url ||
                          'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={branch.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, #0F1218 0%, rgba(15, 18, 24, 0.2) 70%, transparent 100%)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          backdropFilter: 'blur(8px)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          fontSize: '0.78rem',
                          color: '#F3E5AB',
                        }}
                      >
                        <Users size={13} color="#D4AF37" />
                        <span>{staffCount} Master Artists</span>
                      </div>
                    </div>

                    {/* Branch Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h2 className="font-serif" style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '6px' }}>
                        {branch.name}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.84rem', marginBottom: '12px' }}>
                        <MapPin size={14} color="#D4AF37" style={{ flexShrink: 0 }} />
                        <span>{branch.address}</span>
                      </div>
                      <p style={{ color: '#64748B', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                        {branch.description || 'Premium luxury salon offering master haircutting, beard architecture, and scalp wellness.'}
                      </p>

                      <button
                        onClick={() => setSelectedBranch(branch)}
                        className="btn-gold"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          minHeight: '44px',
                        }}
                      >
                        <span>Select Branch</span>
                        <Scissors size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* STEP 2: MEET OUR ARTISTS (SELECTED BRANCH)                                 */
          /* ========================================================================= */
          <motion.div
            key="artist-selection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {/* Top Navigation & Back Button */}
            <div style={{ marginBottom: '24px' }}>
              <button
                onClick={() => setSelectedBranch(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D4AF37',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '6px 0',
                  minHeight: '44px',
                }}
              >
                <ArrowLeft size={16} />
                <span>← Change Branch ({selectedBranch.name})</span>
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  marginBottom: '12px',
                }}
              >
                <MapPin size={14} color="#D4AF37" />
                <span style={{ fontSize: '0.78rem', color: '#F3E5AB', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {selectedBranch.name}
                </span>
              </div>
              <h1 className="font-serif" style={{ fontSize: '2rem', color: '#F8FAFC', fontWeight: 700, marginBottom: '8px' }}>
                Meet Our Artists
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
                Choose an artist and connect directly by phone to discuss your service and schedule.
              </p>
            </div>

            {branchArtists.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#0F1218',
                  borderRadius: '16px',
                  padding: '40px 24px',
                  textAlign: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                }}
              >
                <Users size={36} color="#64748B" style={{ marginBottom: '12px' }} />
                <h3 style={{ color: '#F8FAFC', marginBottom: '6px', fontSize: '1.1rem' }}>No Artists Listed</h3>
                <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
                  There are currently no active stylists assigned to {selectedBranch.name}. Please select another branch.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                }}
              >
                {branchArtists.map((artist) => {
                  const phoneNum = artist.phone?.trim();
                  const hasPhone = Boolean(phoneNum && phoneNum.length > 3);

                  // Extract services assigned to this artist if available
                  const assignedServices = services.filter((s) =>
                    (artist.assigned_service_ids || []).includes(s.id)
                  );

                  return (
                    <motion.div
                      key={artist.id}
                      whileHover={{ y: -4 }}
                      style={{
                        backgroundColor: '#0F1218',
                        borderRadius: '16px',
                        border: '1px solid rgba(212, 175, 55, 0.22)',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      <div>
                        {/* Artist Header Info */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <img
                            src={
                              artist.avatar_url ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                            }
                            alt={artist.name}
                            style={{
                              width: '76px',
                              height: '76px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #D4AF37',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                              <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#F8FAFC', fontWeight: 700 }}>
                                {artist.name}
                              </h3>
                              {artist.rating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F3E5AB', fontSize: '0.78rem' }}>
                                  <Star size={12} color="#D4AF37" fill="#D4AF37" />
                                  <span>{artist.rating}</span>
                                </div>
                              )}
                            </div>
                            <p style={{ color: '#D4AF37', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                              {artist.role_title || 'Master Stylist'}
                            </p>
                            {artist.experience_years && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  color: '#CBD5E1',
                                }}
                              >
                                {artist.experience_years} Years Experience
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Specialization / Bio */}
                        {artist.specialization && (
                          <div style={{ marginBottom: '14px' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                              Specialization
                            </span>
                            <p style={{ color: '#F1F5F9', fontSize: '0.86rem', fontWeight: 500 }}>
                              {artist.specialization}
                            </p>
                          </div>
                        )}

                        {artist.bio && (
                          <p style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '16px' }}>
                            {artist.bio}
                          </p>
                        )}

                        {/* Specialization Pills */}
                        {assignedServices.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                            {assignedServices.slice(0, 3).map((srv) => (
                              <span
                                key={srv.id}
                                style={{
                                  backgroundColor: 'rgba(212, 175, 55, 0.08)',
                                  border: '1px solid rgba(212, 175, 55, 0.2)',
                                  color: '#F3E5AB',
                                  fontSize: '0.75rem',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                }}
                              >
                                {srv.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Direct Phone Call Button */}
                      <div>
                        {hasPhone ? (
                          <a
                            href={`tel:${phoneNum}`}
                            className="btn-gold"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '10px',
                              fontWeight: 700,
                              fontSize: '0.92rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              textDecoration: 'none',
                              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                              minHeight: '46px',
                            }}
                          >
                            <Phone size={18} />
                            <span>📞 Call {artist.name.split(' ')[0]}</span>
                          </a>
                        ) : (
                          <button
                            disabled
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '10px',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#64748B',
                              cursor: 'not-allowed',
                              minHeight: '46px',
                            }}
                          >
                            Phone number unavailable
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
