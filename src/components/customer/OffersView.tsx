import React from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currency';
import { formatDate } from '../../utils/dates';
import { Tag, Copy, Sparkles, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface OffersViewProps {
  onNavigateToBooking?: () => void;
}

export const OffersView: React.FC<OffersViewProps> = ({ onNavigateToBooking }) => {
  const { offers } = useSalonData();
  const { success } = useToast();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const activeOffers = offers.filter((o) => o.is_active);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    success('Promo Code Copied!', `Code "${code}" copied to clipboard.`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Exclusive Privileges & Discounts
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
          Salon Offers & Deals
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
          Enjoy curated seasonal privileges on haircuts, signature beard grooming, and rejuvenating skin therapies.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {activeOffers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4DED4',
              borderRadius: '18px',
              boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
            }}
          >
            {/* Banner Image */}
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <img
                src={offer.banner_image}
                alt={offer.title}
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
                  top: '14px',
                  left: '14px',
                  backgroundColor: '#C9A227',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)',
                }}
              >
                <Sparkles size={13} />
                <span>
                  {offer.discount_type === 'percentage'
                    ? `${offer.discount_value}% OFF`
                    : `Save ${formatPrice(offer.discount_value)}`}
                </span>
              </div>
            </div>

            {/* Offer Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.3rem', color: '#171717', fontWeight: 600, marginBottom: '8px' }}>
                  {offer.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#6F6A62', lineHeight: 1.5, marginBottom: '16px' }}>
                  {offer.description}
                </p>

                <div style={{ fontSize: '0.8rem', color: '#6F6A62', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '18px' }}>
                  <span>Min. Service Bill: {formatPrice(offer.min_bill_amount)}</span>
                  <span>Valid Until: {formatDate(offer.valid_until)}</span>
                </div>
              </div>

              {/* Promo Code Strip & Copy */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F1EDE6',
                  border: '1px dashed #C9A227',
                  borderRadius: '12px',
                  padding: '10px 14px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#6F6A62', textTransform: 'uppercase' }}>
                    Promo Code
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', letterSpacing: '0.05em' }}>
                    {offer.code}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="btn-gold-outline"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check size={14} color="#16845B" />
                      <span style={{ color: '#16845B' }}>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {onNavigateToBooking && (
                <button
                  onClick={onNavigateToBooking}
                  className="btn-gold"
                  style={{ width: '100%', marginTop: '14px', padding: '10px', fontSize: '0.88rem' }}
                >
                  <span>Apply with Booking</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
