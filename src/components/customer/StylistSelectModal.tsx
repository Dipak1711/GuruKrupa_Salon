import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Service, Employee } from '../../types';
import { useSalonData } from '../../context/SalonDataContext';
import { Phone, Star, Award, CheckCircle2, UserX, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

interface StylistSelectModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectStylist: (employee: Employee) => void;
}

export const StylistSelectModal: React.FC<StylistSelectModalProps> = ({
  service,
  isOpen,
  onClose,
  onSelectStylist,
}) => {
  const { employees, isEmployeeAvailable, services } = useSalonData();

  if (!service) return null;

  // Filter stylists assigned to this service
  const capableStylists = employees.filter((emp) =>
    emp.assigned_service_ids.includes(service.id) && emp.is_active
  );

  // If no specific assigned stylists, fallback to all active stylists
  const availableStylists = capableStylists.length > 0 ? capableStylists : employees.filter((e) => e.is_active);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Scissors size={20} color="#D4AF37" />
          <span className="font-serif" style={{ fontSize: '1.35rem', color: '#F8FAFC' }}>
            Choose Your Master Stylist
          </span>
        </div>
      }
      subtitle={`Select a master stylist qualified for: ${service.name}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <p style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
          Our craftsmen specialize in bespoke grooming. You can call directly to consult or proceed with your direct booking request.
        </p>

        {/* Stylists List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {availableStylists.map((stylist) => {
            const isAvailable = isEmployeeAvailable(stylist.id);
            const performedServices = services.filter((s) =>
              stylist.assigned_service_ids.includes(s.id)
            );

            return (
              <motion.div
                key={stylist.id}
                whileHover={isAvailable ? { scale: 1.01 } : {}}
                className="glass-card employee-card-row"
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '16px',
                  alignItems: 'center',
                  opacity: isAvailable ? 1 : 0.65,
                  border: isAvailable
                    ? '1px solid rgba(212, 175, 55, 0.25)'
                    : '1px dashed rgba(244, 63, 94, 0.35)',
                  flexWrap: 'wrap',
                }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', width: '74px', height: '74px', flexShrink: 0 }}>
                  <img
                    src={stylist.avatar_url}
                    alt={stylist.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isAvailable ? '2px solid #D4AF37' : '2px solid #64748B',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: isAvailable ? '#10B981' : '#F43F5E',
                      border: '2px solid #0D0F14',
                    }}
                  />
                </div>

                {/* Stylist Details */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h4
                      className="font-serif"
                      style={{ fontSize: '1.2rem', fontWeight: 600, color: '#F8FAFC' }}
                    >
                      {stylist.name}
                    </h4>

                    {isAvailable ? (
                      <Badge status="available" size="sm" label="Available Today" />
                    ) : (
                      <Badge status="leave" size="sm" label="On Leave" />
                    )}
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#D4AF37', fontWeight: 500, marginBottom: '6px' }}>
                    {stylist.role_title}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={13} color="#F3E5AB" />
                      <span>{stylist.experience_years} Yrs Exp.</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{stylist.rating}</span>
                      <span>({stylist.reviews_count})</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.35, marginBottom: '8px' }}>
                    <strong>Specialization:</strong> {stylist.specialization}
                  </p>

                  {/* Services badges */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {performedServices.slice(0, 3).map((s) => (
                      <span
                        key={s.id}
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: '#94A3B8',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Call & Select Actions (44px min height buttons) */}
                <div
                  className="employee-card-actions"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    justifyContent: 'center',
                    minWidth: '140px',
                  }}
                >
                  {/* Direct Phone Call Button */}
                  <a
                    href={`tel:${stylist.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 14px',
                      minHeight: '44px',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '10px',
                      color: '#F3E5AB',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={14} color="#D4AF37" />
                    <span>Direct Call</span>
                  </a>

                  {/* Select Stylist Button */}
                  {isAvailable ? (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectStylist(stylist);
                      }}
                      className="btn-gold"
                      style={{ padding: '9px 14px', fontSize: '0.84rem', minHeight: '44px' }}
                    >
                      <CheckCircle2 size={15} />
                      <span>Select Stylist</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      style={{
                        padding: '9px 14px',
                        minHeight: '44px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#64748B',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        cursor: 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <UserX size={14} />
                      <span>Unavailable</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
