import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Service } from '../../types';
import { formatPrice } from '../../utils/currency';

interface ServiceCardProps {
  service: Service;
  onViewDetails: (service: Service) => void;
  onBookNow: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onViewDetails,
  onBookNow,
}) => {
  const primaryImage =
    service.images && service.images.length > 0
      ? service.images[0]
      : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="glass-card"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4DED4',
        borderRadius: '18px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
      }}
      onClick={() => onViewDetails(service)}
    >
      {/* Image Container with Luxury Overlay */}
      <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
        <img
          src={primaryImage}
          alt={service.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="service-image-hover"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {/* Subtle Bottom Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(23, 23, 23, 0.5) 0%, rgba(0,0,0,0) 60%)',
          }}
        />

        {/* Duration Badge */}
        {service.duration_mins && (
          <div
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #E4DED4',
              borderRadius: '9999px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#171717',
            }}
          >
            <Clock size={12} color="#C9A227" />
            <span>{service.duration_mins} mins</span>
          </div>
        )}

        {/* Price Tag Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            backgroundColor: '#C9A227',
            color: '#171717',
            padding: '4px 12px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '1.05rem',
            boxShadow: '0 4px 14px rgba(201, 162, 39, 0.3)',
          }}
        >
          {formatPrice(service.price)}
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: '20px 18px 18px 18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3
            className="font-serif"
            style={{
              fontSize: '1.22rem',
              fontWeight: 600,
              color: '#171717',
              marginBottom: '8px',
              lineHeight: 1.3,
            }}
          >
            {service.name}
          </h3>

          <p
            style={{
              fontSize: '0.86rem',
              color: '#6F6A62',
              lineHeight: 1.45,
              marginBottom: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {service.short_description || service.description}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(service);
            }}
            className="btn-gold-outline"
            style={{ flex: 1, padding: '9px 12px', fontSize: '0.82rem' }}
          >
            <span>Details</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(service);
            }}
            className="btn-gold"
            style={{ flex: 1.3, padding: '9px 12px', fontSize: '0.84rem' }}
          >
            <Sparkles size={14} />
            <span>Book Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
