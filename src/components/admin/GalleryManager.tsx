import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { GalleryItem } from '../../types';
import { Modal } from '../common/Modal';
import { Image, Plus, Trash2 } from 'lucide-react';

export const GalleryManager: React.FC = () => {
  const { gallery, addGalleryItem } = useSalonData();
  const { success } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hair & Beard');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [stylistName, setStylistName] = useState('Rahul Sharma');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryItem({
      id: `gal-${Date.now()}`,
      title,
      category,
      image_url: imageUrl,
      description,
      stylist_name: stylistName,
    });
    success('Portfolio Item Added', 'New work published to salon showcase gallery.');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Showcase Portfolio
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
            Salon Gallery Management ({gallery.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
            Publish signature haircut transformations and aesthetic styling photographs.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-gold" style={{ padding: '10px 22px' }}>
          <Plus size={18} />
          <span>Upload Portfolio Item</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {gallery.map((item, idx) => (
          <div key={item.id || idx} className="glass-card" style={{ overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4', borderRadius: '18px' }}>
            <div style={{ position: 'relative', height: '220px' }}>
              <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#171717', color: '#E7D18A', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                {item.category}
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <h4 className="font-serif" style={{ fontSize: '1.15rem', color: '#171717', fontWeight: 600, marginBottom: '6px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#6F6A62', lineHeight: 1.4 }}>{item.description}</p>
              {item.stylist_name && (
                <div style={{ fontSize: '0.78rem', color: '#C9A227', marginTop: '8px', fontWeight: 600 }}>
                  Artist: {item.stylist_name}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" title="Add Gallery Showcase Item">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Title *</label>
            <input type="text" className="salon-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Bespoke Skin Fade" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Category *</label>
              <input type="text" className="salon-input" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Master Artist Name</label>
              <input type="text" className="salon-input" value={stylistName} onChange={(e) => setStylistName(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Image URL *</label>
            <input type="url" className="salon-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." required />
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Description *</label>
            <textarea className="salon-input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E4DED4', paddingTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-gold-outline" style={{ padding: '10px 18px' }}>Cancel</button>
            <button type="submit" className="btn-gold" style={{ padding: '10px 24px' }}>Publish Item</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
