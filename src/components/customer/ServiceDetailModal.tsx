import React from 'react';
import { Modal } from '../common/Modal';
import { ImageSlider } from '../common/ImageSlider';
import { Service } from '../../types';
import { formatPrice } from '../../utils/currency';
import { Clock, CheckCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (service: Service) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onBookNow,
}) => {
  if (!service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="#D4AF37" />
          <span className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC' }}>
            {service.name}
          </span>
        </div>
      }
      subtitle={`Duration: ~${service.duration_mins} mins • Dynamic Salon Pricing`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Multi-Image Slider */}
        <ImageSlider images={service.images} alt={service.name} height="320px" />

        {/* Price & Duration Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Service Fee
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#F3E5AB' }}>
              {formatPrice(service.price)}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#CBD5E1', fontSize: '0.9rem' }}>
              <Clock size={18} color="#D4AF37" />
              <span>{service.duration_mins} minutes</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookNow(service);
              }}
              className="btn-gold"
              style={{ padding: '10px 22px', fontSize: '0.92rem' }}
            >
              <span>Book Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h4
            className="font-serif"
            style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '8px' }}
          >
            About This Experience
          </h4>
          <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            {service.description || service.short_description}
          </p>
        </div>

        {/* Key Benefits & Inclusions */}
        {service.benefits && service.benefits.length > 0 && (
          <div>
            <h4
              className="font-serif"
              style={{
                fontSize: '1.15rem',
                color: '#F8FAFC',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={18} color="#D4AF37" />
              <span>What’s Included & Key Benefits</span>
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
              {service.benefits.map((benefit, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                  }}
                >
                  <CheckCircle size={16} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.86rem', color: '#E2E8F0', lineHeight: 1.4 }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Booking CTA Banner */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button onClick={onClose} className="btn-dark" style={{ padding: '11px 20px' }}>
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onBookNow(service);
            }}
            className="btn-gold"
            style={{ padding: '12px 28px', fontSize: '0.96rem' }}
          >
            <Sparkles size={16} />
            <span>Select Master Stylist & Book</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Modal>
  );
};
