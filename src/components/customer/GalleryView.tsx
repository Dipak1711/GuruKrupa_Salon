import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { gallery } = useSalonData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filteredGallery =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((g) => g.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Master Craft & Aesthetics
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
          Salon Gallery & Transformations
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
          Explore signature hairstyles, beard architecture, and skincare rejuvenation crafted by our master artists.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: selectedCategory === cat ? '1px solid #C9A227' : '1px solid #E4DED4',
              backgroundColor: selectedCategory === cat ? 'rgba(201, 162, 39, 0.14)' : '#FFFFFF',
              color: selectedCategory === cat ? '#171717' : '#6F6A62',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {filteredGallery.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.06 }}
            className="glass-card"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4DED4',
              borderRadius: '18px',
              boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
            }}
          >
            <div style={{ position: 'relative', height: '280px', width: '100%', overflow: 'hidden' }}>
              <img
                src={item.image_url}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(23, 23, 23, 0.4) 0%, transparent 60%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid #E4DED4',
                  color: '#171717',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                }}
              >
                {item.category}
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 600 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#6F6A62', lineHeight: 1.45 }}>
                {item.description}
              </p>
              {item.stylist_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#C9A227', marginTop: '6px', fontWeight: 600 }}>
                  <Sparkles size={13} />
                  <span>Master Artist: {item.stylist_name}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
