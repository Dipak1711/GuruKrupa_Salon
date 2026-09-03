import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { Offer } from '../../types';
import { Modal } from '../common/Modal';
import { formatPrice } from '../../utils/currency';
import { formatDate } from '../../utils/dates';
import { Tag, Plus, Edit2, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

export const OfferManager: React.FC = () => {
  const { offers, addOffer, updateOffer, toggleOfferActive } = useSalonData();
  const { success } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [minBillAmount, setMinBillAmount] = useState<number>(500);
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setTitle('');
    setCode('FESTIVE25');
    setDiscountType('percentage');
    setDiscountValue(25);
    setMinBillAmount(600);
    setValidUntil('2026-12-31');
    setDescription('Exclusive festive savings on all premium haircuts and styling combos.');
    setBannerImage('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setTitle(offer.title);
    setCode(offer.code);
    setDiscountType(offer.discount_type);
    setDiscountValue(offer.discount_value);
    setMinBillAmount(offer.min_bill_amount);
    setValidUntil(offer.valid_until);
    setDescription(offer.description);
    setBannerImage(offer.banner_image);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingOffer) {
      updateOffer(editingOffer.id, {
        title,
        code,
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_bill_amount: Number(minBillAmount),
        valid_until: validUntil,
        description,
        banner_image: bannerImage,
      });
      success('Offer Updated', `Promo code "${code}" updated.`);
    } else {
      addOffer({
        title,
        code,
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_bill_amount: Number(minBillAmount),
        valid_until: validUntil,
        description,
        banner_image: bannerImage,
        is_active: true,
      });
      success('Offer Created', `Promo code "${code}" published for customers.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Promotions & Campaigns
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
            Salon Offers & Discounts ({offers.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
            Create and manage promo codes visible on the customer privilege page.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-gold" style={{ padding: '10px 22px' }}>
          <Plus size={18} />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="glass-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              opacity: offer.is_active ? 1 : 0.6,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4DED4',
              borderRadius: '18px',
            }}
          >
            <div>
              <div style={{ position: 'relative', height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                <img src={offer.banner_image} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#C9A227', color: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {offer.code}
                </div>
              </div>

              <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 600, marginBottom: '6px' }}>
                {offer.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#6F6A62', lineHeight: 1.4, marginBottom: '10px' }}>
                {offer.description}
              </p>
              <div style={{ fontSize: '0.78rem', color: '#6F6A62' }}>
                Valid Until: {formatDate(offer.valid_until)} • Min Bill: {formatPrice(offer.min_bill_amount)}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E4DED4', paddingTop: '12px' }}>
              <button
                onClick={() => toggleOfferActive(offer.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: offer.is_active ? '#16845B' : '#6F6A62',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {offer.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{offer.is_active ? 'Active' : 'Inactive'}</span>
              </button>

              <button onClick={() => handleOpenEdit(offer)} className="btn-gold-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <Edit2 size={13} />
                <span>Edit Offer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        title={editingOffer ? 'Edit Promo Offer' : 'Create New Salon Offer'}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Title *</label>
            <input type="text" className="salon-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Promo Code *</label>
              <input type="text" className="salon-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Discount Type *</label>
              <select className="salon-select" value={discountType} onChange={(e) => setDiscountType(e.target.value as any)}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Discount Value ({discountType === 'percentage' ? '%' : '₹'}) *
              </label>
              <input type="number" min="1" className="salon-input" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} required />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Min Bill Amount (₹) *</label>
              <input type="number" min="0" className="salon-input" value={minBillAmount} onChange={(e) => setMinBillAmount(Number(e.target.value))} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Valid Until Date *</label>
            <input type="date" className="salon-input" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Banner Image URL</label>
            <input type="url" className="salon-input" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Description *</label>
            <textarea className="salon-input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E4DED4', paddingTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-gold-outline" style={{ padding: '10px 18px' }}>Cancel</button>
            <button type="submit" className="btn-gold" style={{ padding: '10px 24px' }}>Save Offer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
