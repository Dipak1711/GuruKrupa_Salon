import React, { useState, useEffect } from 'react';
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

  // Scroll to top on mount or when branch changes
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.scrollTop = 0;
    };

    scrollToTop();
    const raf1 = requestAnimationFrame(scrollToTop);
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(scrollToTop));
    const timer = setTimeout(scrollToTop, 100);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
  }, [selectedBranch]);

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
                  backgroundColor: 'rgba(201, 162, 39, 0.12)',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  marginBottom: '12px',
                }}
              >
                <Scissors size={14} color="#C9A227" />
                <span style={{ fontSize: '0.78rem', color: '#9A7B1C', fontWeight: 600, letterSpacing: '0.05em' }}>
                  STEP 1 OF 2
                </span>
              </div>
              <h1 className="font-serif" style={{ fontSize: '2rem', color: '#171717', fontWeight: 700, marginBottom: '8px' }}>
                Choose Your Salon
              </h1>
              <p style={{ color: '#6F6A62', fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto' }}>
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
                      backgroundColor: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px solid #E4DED4',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
                    }}
                  >
                    {/* Branch Image Header */}
                    <div style={{ height: '180px', position: 'relative', overflow: 'hidden', backgroundColor: '#F1EDE6' }}>
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
                          background: 'linear-gradient(to top, rgba(23, 23, 23, 0.4) 0%, transparent 100%)',
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
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(8px)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: '1px solid #E4DED4',
                          fontSize: '0.78rem',
                          color: '#171717',
                          fontWeight: 600,
                        }}
                      >
                        <Users size={13} color="#C9A227" />
                        <span>{staffCount} Master Artists</span>
                      </div>
                    </div>

                    {/* Branch Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h2 className="font-serif" style={{ fontSize: '1.25rem', color: '#171717', fontWeight: 600, marginBottom: '6px' }}>
                        {branch.name}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6F6A62', fontSize: '0.84rem', marginBottom: '12px' }}>
                        <MapPin size={14} color="#C9A227" style={{ flexShrink: 0 }} />
                        <span>{branch.address}</span>
                      </div>
                      <p style={{ color: '#6F6A62', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
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
                  color: '#C9A227',
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

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(201, 162, 39, 0.12)',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  marginBottom: '12px',
                }}
              >
                <MapPin size={14} color="#C9A227" />
                <span style={{ fontSize: '0.78rem', color: '#9A7B1C', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {selectedBranch.name}
                </span>
              </div>
              <h1 className="font-serif" style={{ fontSize: '2rem', color: '#171717', fontWeight: 700, marginBottom: '8px' }}>
                Meet Our Artists
              </h1>
              <p style={{ color: '#6F6A62', fontSize: '0.92rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
                Browse our master artists below, then call the branch owner directly to discuss your service and schedule.
              </p>
            </div>

            {/* Prominent Branch Owner Call Hero Section */}
            <div
              style={{
                backgroundColor: 'rgba(201, 162, 39, 0.08)',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px',
                boxShadow: '0 4px 18px rgba(201, 162, 39, 0.12)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={20} color="#C9A227" />
                <span style={{ fontSize: '1.05rem', color: '#171717', fontWeight: 700 }}>
                  Direct Branch Desk — {selectedBranch.name}
                </span>
              </div>
              <p style={{ color: '#6F6A62', fontSize: '0.86rem', margin: 0, maxWidth: '540px', lineHeight: 1.5 }}>
                Connect directly with our branch desk manager to discuss artist availability, VIP services, and schedule your appointment.
              </p>
              <a
                href={`tel:${(selectedBranch.phone || '+91 98230 12345').replace(/\s+/g, '')}`}
                className="btn-gold"
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  minHeight: '48px',
                  width: '100%',
                  maxWidth: '380px',
                }}
              >
                <Phone size={20} />
                <span>📞 Call Branch Owner ({selectedBranch.phone || '+91 98230 12345'})</span>
              </a>
            </div>

            {branchArtists.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '40px 24px',
                  textAlign: 'center',
                  border: '1px solid #E4DED4',
                }}
              >
                <Users size={36} color="#8C857B" style={{ marginBottom: '12px' }} />
                <h3 style={{ color: '#171717', marginBottom: '6px', fontSize: '1.1rem' }}>No Artists Listed</h3>
                <p style={{ color: '#6F6A62', fontSize: '0.88rem' }}>
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
                  const assignedServices = services.filter((s) =>
                    (artist.assigned_service_ids || []).includes(s.id)
                  );

                  return (
                    <motion.div
                      key={artist.id}
                      whileHover={{ y: -4 }}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '18px',
                        border: '1px solid #E4DED4',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
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
                              border: '2px solid #C9A227',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                              <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 700 }}>
                                {artist.name}
                              </h3>
                              {artist.rating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#B7791F', fontSize: '0.78rem', fontWeight: 600 }}>
                                  <Star size={12} color="#B7791F" fill="#B7791F" />
                                  <span>{artist.rating}</span>
                                </div>
                              )}
                            </div>
                            <p style={{ color: '#C9A227', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                              {artist.role_title || 'Master Stylist'}
                            </p>
                            {artist.experience_years && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  backgroundColor: '#F1EDE6',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  color: '#6F6A62',
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
                            <span style={{ fontSize: '0.74rem', color: '#8C857B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                              Specialization
                            </span>
                            <p style={{ color: '#171717', fontSize: '0.86rem', fontWeight: 500 }}>
                              {artist.specialization}
                            </p>
                          </div>
                        )}

                        {artist.bio && (
                          <p style={{ color: '#6F6A62', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '16px' }}>
                            {artist.bio}
                          </p>
                        )}

                        {/* Specialization Pills */}
                        {assignedServices.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {assignedServices.slice(0, 3).map((srv) => (
                              <span
                                key={srv.id}
                                style={{
                                  backgroundColor: 'rgba(201, 162, 39, 0.1)',
                                  border: '1px solid rgba(201, 162, 39, 0.25)',
                                  color: '#9A7B1C',
                                  fontSize: '0.75rem',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontWeight: 500,
                                }}
                              >
                                {srv.name}
                              </span>
                            ))}
                          </div>
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
