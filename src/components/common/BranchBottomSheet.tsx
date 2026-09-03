import React from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { Building2, MapPin, Phone, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BranchBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BranchBottomSheet: React.FC<BranchBottomSheetProps> = ({ isOpen, onClose }) => {
  const { branches, activeBranchId, setActiveBranchId } = useSalonData();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 23, 23, 0.4)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        />

        {/* Bottom Sheet Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          style={{
            position: 'relative',
            zIndex: 1000,
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            borderTop: '1px solid #E4DED4',
            boxShadow: '0 -10px 40px rgba(23, 23, 23, 0.12)',
            padding: '20px 18px calc(24px + env(safe-area-inset-bottom, 0px)) 18px',
            maxHeight: '85vh',
            overflowY: 'auto',
          }}
        >
          {/* Top Handle Pill */}
          <div style={{ width: '40px', height: '4px', backgroundColor: '#E4DED4', borderRadius: '999px', margin: '0 auto 16px auto' }} />

          {/* Sheet Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={22} color="#C9A227" />
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#171717', fontWeight: 700, lineHeight: 1.2 }}>
                  Choose Salon Studio
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#6F6A62' }}>Select your managing branch</span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F1EDE6',
                border: '1px solid #E4DED4',
                color: '#6F6A62',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Branch Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {branches.map((branch) => {
              const isSelected = branch.id === activeBranchId;
              return (
                <div
                  key={branch.id}
                  onClick={() => {
                    setActiveBranchId(branch.id);
                    onClose();
                  }}
                  style={{
                    backgroundColor: isSelected ? 'rgba(201, 162, 39, 0.08)' : '#F7F4EF',
                    border: isSelected ? '1.5px solid #C9A227' : '1px solid #E4DED4',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, backgroundColor: isSelected ? '#C9A227' : '#E4DED4', color: isSelected ? '#FFFFFF' : '#171717', padding: '2px 8px', borderRadius: '6px' }}>
                        {branch.code}
                      </span>
                      <h4 className="font-serif" style={{ fontSize: '1.1rem', color: '#171717', fontWeight: 600 }}>
                        {branch.name}
                      </h4>
                    </div>

                    {isSelected && <CheckCircle2 size={20} color="#C9A227" style={{ flexShrink: 0 }} />}
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#6F6A62', lineHeight: 1.4, marginBottom: '10px' }}>
                    {branch.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#6F6A62' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={14} color="#C9A227" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ color: '#171717', lineHeight: 1.3 }}>{branch.address}</span>
                    </div>

                    {branch.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} color="#C9A227" />
                        <a href={`tel:${branch.phone}`} style={{ color: '#9A7B1C', textDecoration: 'none', fontWeight: 600 }}>
                          {branch.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
