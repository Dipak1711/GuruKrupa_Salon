import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { Service, Employee, Branch } from '../../types';
import { ServiceCard } from './ServiceCard';
import { ServiceDetailModal } from './ServiceDetailModal';
import { formatPrice } from '../../utils/currency';
import { formatDate } from '../../utils/dates';
import {
  Scissors,
  Sparkles,
  Award,
  ShieldCheck,
  Star,
  Clock,
  Phone,
  ArrowRight,
  MapPin,
  Tag,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

import { EmptyState } from '../common/EmptyState';

interface CustomerHomeProps {
  onNavigateToView: (view: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ onNavigateToView }) => {
  const { categories, services, employees, offers, gallery, reviews, isLoading } = useSalonData();
  const { success } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Service Detail Modal State
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter active dynamic services from database
  const activeServices = services.filter((s) => s.is_active);

  const filteredServices = activeServices.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category_id === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    success('Promo Code Copied', `Code "${code}" copied to clipboard.`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleViewDetails = (service: Service) => {
    setDetailService(service);
    setIsDetailOpen(true);
  };

  const handleStartBooking = (_service?: Service) => {
    onNavigateToView('booking');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* 1. HERO SECTION */}
      <div
        className="glass-card hero-card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '52px 36px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F1EDE6 100%)',
          border: '1px solid #E4DED4',
          borderRadius: '28px',
          boxShadow: '0 8px 30px rgba(23, 23, 23, 0.04)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            backgroundColor: 'rgba(201, 162, 39, 0.08)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(201, 162, 39, 0.12)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#9A7B1C',
              marginBottom: '18px',
            }}
          >
            <Sparkles size={14} color="#C9A227" />
            <span>The Royal Standard in Grooming & Styling</span>
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.1rem, 4vw, 3.2rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#171717',
              marginBottom: '16px',
            }}
          >
            Bespoke Mastery for the <span className="gold-gradient-text">Modern Connoisseur</span>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: '#6F6A62',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            Welcome to GuruKrupa SALON. Select your desired service, explore detailed multi-image showcases, and connect directly with master craftsmen.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const srvSection = document.getElementById('services-section');
                srvSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-gold"
              style={{ padding: '13px 26px' }}
            >
              <Scissors size={18} />
              <span>Explore Services</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigateToView('offers')}
              className="btn-gold-outline"
              style={{ padding: '13px 22px' }}
            >
              <Sparkles size={16} color="#C9A227" />
              <span>View Privileges & Offers</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SERVICE CATEGORIES SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Taxonomy & Disciplines
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: '#171717', fontWeight: 700 }}>
            Service Categories
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
          }}
        >
          {categories.map((cat) => {
            const catCount = activeServices.filter((s) => s.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -3 }}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const srvSection = document.getElementById('services-section');
                  srvSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-card"
                style={{
                  padding: '18px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid #C9A227' : '1px solid #E4DED4',
                  backgroundColor: isSelected ? 'rgba(201, 162, 39, 0.1)' : '#FFFFFF',
                  minHeight: '110px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#F1EDE6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C9A227',
                    marginBottom: '10px',
                  }}
                >
                  <Layers size={18} />
                </div>

                <h4 style={{ fontSize: '0.96rem', color: '#171717', fontWeight: 600, marginBottom: '2px' }}>
                  {cat.name}
                </h4>
                <span style={{ fontSize: '0.76rem', color: '#6F6A62' }}>{catCount} Services</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC SERVICES CATALOG SECTION */}
      <div id="services-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Curated Menu
            </span>
            <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
              Dynamic Services ({filteredServices.length})
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6F6A62', marginTop: '2px' }}>
              Prices and descriptions are served live from our database.
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: '280px' }}>
            <input
              type="text"
              className="salon-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Haircut, Shave, Facial..."
            />
          </div>
        </div>

        {/* Filter Pills (Smooth Mobile Horizontal Scroll) */}
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px', WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              border: selectedCategory === 'all' ? '1px solid #C9A227' : '1px solid #E4DED4',
              backgroundColor: selectedCategory === 'all' ? 'rgba(201, 162, 39, 0.14)' : '#FFFFFF',
              color: selectedCategory === 'all' ? '#171717' : '#6F6A62',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minHeight: '44px',
            }}
          >
            All Services ({activeServices.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '9999px',
                border: selectedCategory === cat.id ? '1px solid #C9A227' : '1px solid #E4DED4',
                backgroundColor: selectedCategory === cat.id ? 'rgba(201, 162, 39, 0.14)' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#171717' : '#6F6A62',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                minHeight: '44px',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Responsive Grid for Services */}
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6F6A62' }}>
            <Sparkles size={24} color="#C9A227" style={{ marginBottom: '12px', animation: 'spin 2s linear infinite' }} />
            <p>Loading live services from Supabase...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <EmptyState
            icon={<Scissors size={28} />}
            title="No Services Available"
            description={
              searchQuery || selectedCategory !== 'all'
                ? 'No salon services match your current filter criteria.'
                : 'No active services are registered in the Supabase database yet.'
            }
          />
        ) : (
          <div
            className="service-card-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onViewDetails={handleViewDetails}
                onBookNow={handleStartBooking}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. OFFERS PREVIEW SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Privileges
            </span>
            <h2 className="font-serif" style={{ fontSize: '2rem', color: '#171717', fontWeight: 700 }}>
              Exclusive Salon Offers
            </h2>
          </div>

          <button onClick={() => onNavigateToView('offers')} className="btn-gold-outline" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            <span>View All Offers</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
          {offers.filter((o) => o.is_active).slice(0, 2).map((offer) => (
            <div
              key={offer.id}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                flexWrap: 'wrap',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4DED4',
              }}
            >
              <img
                src={offer.banner_image}
                alt={offer.title}
                style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9A7B1C', backgroundColor: 'rgba(201, 162, 39, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    {offer.code}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#16845B', fontWeight: 600 }}>
                    {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `Save ₹${offer.discount_value}`}
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', color: '#171717', fontWeight: 600, marginBottom: '4px' }}>
                  {offer.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#6F6A62', lineHeight: 1.35 }}>
                  {offer.description}
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(offer.code)}
                className="btn-gold-outline"
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              >
                {copiedCode === offer.code ? <Check size={14} color="#16845B" /> : <Copy size={14} />}
                <span>{copiedCode === offer.code ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FEATURED EMPLOYEES / STYLISTS SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Master Craftsmen
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: '#171717', fontWeight: 700 }}>
            Featured Master Stylists
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6F6A62', marginTop: '2px' }}>
            Directly selectable stylists for your booking request with direct phone call links.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          {employees
            .filter((e) => e.is_active)
            .map((emp) => (
              <div
                key={emp.id}
                className="glass-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4DED4',
                }}
              >
                <img
                  src={emp.avatar_url}
                  alt={emp.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #C9A227',
                    marginBottom: '12px',
                  }}
                />
                <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 600 }}>
                  {emp.name}
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#C9A227', fontWeight: 600, marginBottom: '6px' }}>
                  {emp.role_title}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#6F6A62', marginBottom: '14px' }}>
                  {emp.experience_years} Yrs Exp • ★ {emp.rating} ({emp.reviews_count})
                </span>

                <button
                  onClick={() => onNavigateToView('booking')}
                  className="btn-gold-outline"
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.82rem' }}
                >
                  <Scissors size={14} color="#C9A227" />
                  <span>Book at Branch</span>
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* 6. GALLERY PREVIEW SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Showcase Portfolio
            </span>
            <h2 className="font-serif" style={{ fontSize: '2rem', color: '#171717', fontWeight: 700 }}>
              Transformations & Styles
            </h2>
          </div>

          <button onClick={() => onNavigateToView('gallery')} className="btn-gold-outline" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            <span>Explore Full Gallery</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {gallery.slice(0, 3).map((item, idx) => (
            <div key={item.id || idx} className="glass-card" style={{ overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4' }}>
              <div style={{ position: 'relative', height: '220px' }}>
                <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#171717', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600, border: '1px solid #E4DED4' }}>
                  {item.category}
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <h4 className="font-serif" style={{ fontSize: '1.1rem', color: '#171717', fontWeight: 600, marginBottom: '4px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#6F6A62', lineHeight: 1.4 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. REVIEWS SECTION */}
      <div
        className="glass-card"
        style={{
          padding: '36px 28px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F1EDE6 100%)',
          border: '1px solid #E4DED4',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Client Endorsements
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: '#171717', fontWeight: 700 }}>
            Celebrated by Mumbai Connoisseurs
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4DED4',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} color="#B7791F" fill="#B7791F" />
                  ))}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#171717', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid #E4DED4', paddingTop: '12px', marginTop: '14px' }}>
                <h4 style={{ fontSize: '0.92rem', color: '#171717', fontWeight: 600 }}>{rev.customer_name}</h4>
                <span style={{ fontSize: '0.78rem', color: '#C9A227', fontWeight: 600 }}>{rev.service_name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. CONTACT & STUDIO INFO SECTION */}
      <div className="glass-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', border: '1px solid #E4DED4' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C9A227', marginBottom: '8px' }}>
              <Phone size={18} />
              <h4 style={{ fontSize: '1rem', color: '#171717', fontWeight: 600 }}>Direct VIP Phone Desk</h4>
            </div>
            <a
              href="tel:+919823012345"
              style={{ fontSize: '1.25rem', fontWeight: 700, color: '#9A7B1C', textDecoration: 'none', display: 'block', marginBottom: '4px' }}
            >
              +91 98230 12345
            </a>
            <p style={{ fontSize: '0.82rem', color: '#6F6A62' }}>
              Instant call desk for consultations & special arrangements
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C9A227', marginBottom: '8px' }}>
              <Clock size={18} />
              <h4 style={{ fontSize: '1rem', color: '#171717', fontWeight: 600 }}>Studio Hours</h4>
            </div>
            <p style={{ fontSize: '0.96rem', color: '#171717', fontWeight: 600, marginBottom: '2px' }}>
              Monday – Sunday: 09:00 AM – 09:30 PM
            </p>
            <p style={{ fontSize: '0.82rem', color: '#16845B', fontWeight: 600 }}>
              Open 7 days a week • Valet parking available
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C9A227', marginBottom: '8px' }}>
              <MapPin size={18} />
              <h4 style={{ fontSize: '1rem', color: '#171717', fontWeight: 600 }}>Studio Address</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#6F6A62', lineHeight: 1.4 }}>
              Linking Road, Bandra West, Mumbai, Maharashtra 400050
            </p>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={detailService}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onBookNow={(srv) => {
          setIsDetailOpen(false);
          handleStartBooking(srv);
        }}
      />
    </div>
  );
};
