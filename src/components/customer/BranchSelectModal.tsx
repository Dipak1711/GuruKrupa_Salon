import React from 'react';
import { Modal } from '../common/Modal';
import { Branch, Service } from '../../types';
import { useSalonData } from '../../context/SalonDataContext';
import { Building2, MapPin, Phone, CheckCircle2, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

interface BranchSelectModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectBranch: (branch: Branch) => void;
}

export const BranchSelectModal: React.FC<BranchSelectModalProps> = ({
  service,
  isOpen,
  onClose,
  onSelectBranch,
}) => {
  const { branches } = useSalonData();

  if (!service) return null;

  const activeBranches = branches.filter((b) => b.status === 'active');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building2 size={20} color="#D4AF37" />
          <span className="font-serif" style={{ fontSize: '1.35rem', color: '#F8FAFC' }}>
            Select Preferred Salon Branch
          </span>
        </div>
      }
      subtitle={`Choose your convenient location for: ${service.name}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
          GuruKrupa SALON operates luxury studios across prime destinations. Select your preferred branch to view available master craftsmen.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {activeBranches.map((branch, idx) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <div>
                {branch.image_url && (
                  <div style={{ height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                    <img
                      src={branch.image_url}
                      alt={branch.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 600 }}>
                    {branch.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#0A0C10',
                      backgroundColor: '#D4AF37',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {branch.code}
                  </span>
                </div>

                {branch.description && (
                  <p style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: 1.4, marginBottom: '12px' }}>
                    {branch.description}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#94A3B8' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={15} color="#D4AF37" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: '#E2E8F0', lineHeight: 1.35 }}>{branch.address}</span>
                  </div>

                  {branch.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} color="#D4AF37" />
                      <a href={`tel:${branch.phone}`} style={{ color: '#F3E5AB', textDecoration: 'none', fontWeight: 500 }}>
                        {branch.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onSelectBranch(branch);
                }}
                className="btn-gold"
                style={{ padding: '10px 18px', width: '100%', minHeight: '44px', fontSize: '0.88rem' }}
              >
                <CheckCircle2 size={16} />
                <span>Select {branch.name}</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
