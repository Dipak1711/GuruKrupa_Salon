import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { Service, Employee } from '../../types';
import { ServiceCard } from './ServiceCard';
import { ServiceDetailModal } from './ServiceDetailModal';
import { StylistSelectModal } from './StylistSelectModal';
import { BookingSummaryModal } from './BookingSummaryModal';
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

  // Booking Flow Modals State
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [selectedStylistForBooking, setSelectedStylistForBooking] = useState<Employee | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStylistSelectOpen, setIsStylistSelectOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

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

  // Flow handlers
  const handleViewDetails = (service: Service) => {
    setDetailService(service);
    setIsDetailOpen(true);
  };

  const handleStartBooking = (service: Service) => {
    setSelectedServiceForBooking(service);
    setIsStylistSelectOpen(true);
  };

  const handleSelectStylist = (stylist: Employee) => {
    setSelectedStylistForBooking(stylist);
    setIsStylistSelectOpen(false);
    setIsSummaryOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsSummaryOpen(false);
    setSelectedServiceForBooking(null);
    setSelectedStylistForBooking(null);
    onNavigateToView('my-appointments');
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
          background: 'linear-gradient(135deg, rgba(22, 26, 36, 0.95) 0%, rgba(10, 12, 16, 0.98) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '28px',
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
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#F3E5AB',
              marginBottom: '18px',
            }}
          >
            <Sparkles size={14} color="#D4AF37" />
            <span>The Royal Standard in Grooming & Styling</span>
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.1rem, 4vw, 3.2rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: '16px',
            }}
          >
            Bespoke Mastery for the <span className="gold-gradient-text">Modern Connoisseur</span>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: '#CBD5E1',
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
              <Sparkles size={16} />
              <span>View Privileges & Offers</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SERVICE CATEGORIES SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Taxonomy & Disciplines
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: '#F8FAFC', fontWeight: 700 }}>
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
                  border: isSelected ? '1.5px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.2)',
                  backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.14)' : 'rgba(18, 22, 30, 0.8)',
                  minHeight: '110px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D4AF37',
                    marginBottom: '10px',
                  }}
                >
                  <Layers size={18} />
                </div>

                <h4 style={{ fontSize: '0.96rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '2px' }}>
                  {cat.name}
                </h4>
                <span style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{catCount} Services</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC SERVICES CATALOG SECTION */}
      <div id="services-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Curated Menu
            </span>
            <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
              Dynamic Services ({filteredServices.length})
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '2px' }}>
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

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: selectedCategory === 'all' ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: selectedCategory === 'all' ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedCategory === 'all' ? '#F3E5AB' : '#94A3B8',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minHeight: '40px',
            }}
          >
            All Services ({activeServices.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: selectedCategory === cat.id ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: selectedCategory === cat.id ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat.id ? '#F3E5AB' : '#94A3B8',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minHeight: '40px',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Responsive Grid for Services (1 column mobile, 2+ column desktop) */}
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
            <Sparkles size={24} color="#D4AF37" style={{ marginBottom: '12px', animation: 'spin 2s linear infinite' }} />
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
            <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Privileges
            </span>
            <h2 className="font-serif" style={{ fontSize: '2rem', color: '#F8FAFC', fontWeight: 700 }}>
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
              }}
            >
              <img
                src={offer.banner_image}
                alt={offer.title}
                style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    {offer.code}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                    {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `Save ₹${offer.discount_value}`}
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '4px' }}>
                  {offer.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.35 }}>
                  {offer.description}
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(offer.code)}
                className="btn-gold-outline"
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              >
                {copiedCode === offer.code ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copiedCode === offer.code ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FEATURED EMPLOYEES / STYLISTS SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Master Craftsmen
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: '#F8FAFC', fontWeight: 700 }}>
            Featured Master Stylists
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '2px' }}>
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
                    border: '2px solid #D4AF37',
                    marginBottom: '12px',
                  }}
                />
                <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#F8FAFC', fontWeight: 600 }}>
                  {emp.name}
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#D4AF37', fontWeight: 500, marginBottom: '6px' }}>
                  {emp.role_title}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '14px' }}>
                  {emp.experience_years} Yrs Exp • ★ {emp.rating} ({emp.reviews_count})
                </span>

                <a
                  href={`tel:${emp.phone}`}
                  className="btn-gold-outline"
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.82rem' }}
                >
                  <Phone size={14} color="#D4AF37" />
                  <span>Call {emp.name.split(' ')[0]}</span>
                </a>
              </div>
            ))}
        </div>
      </div>

      {/* 6. GALLERY PREVIEW SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Showcase Portfolio
            </span>
            <h2 className="font-serif" style={{ fontSize: '2rem', color: '#F8FAFC', fontWeight: 700 }}>
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
            <div key={item.id || idx} className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '220px' }}>
                <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(10, 12, 16, 0.85)', color: '#F3E5AB', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600 }}>
                  {item.category}
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <h4 className="font-serif" style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '4px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.4 }}>
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
          background: 'linear-gradient(135deg, rgba(22, 26, 36, 0.8) 0%, rgba(12, 15, 21, 0.9) 100%)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Client Endorsements
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: '#F8FAFC', fontWeight: 700 }}>
            Celebrated by Mumbai Connoisseurs
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
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
                    <Star key={i} size={15} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px', marginTop: '14px' }}>
                <h4 style={{ fontSize: '0.92rem', color: '#F8FAFC', fontWeight: 600 }}>{rev.customer_name}</h4>
                <span style={{ fontSize: '0.78rem', color: '#D4AF37' }}>{rev.service_name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. CONTACT & STUDIO INFO SECTION */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', marginBottom: '8px' }}>
              <Phone size={18} />
              <h4 style={{ fontSize: '1rem', color: '#F8FAFC', fontWeight: 600 }}>Direct VIP Phone Desk</h4>
            </div>
            <a
              href="tel:+919823012345"
              style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F3E5AB', textDecoration: 'none', display: 'block', marginBottom: '4px' }}
            >
              +91 98230 12345
            </a>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              Instant call desk for consultations & special arrangements
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', marginBottom: '8px' }}>
              <Clock size={18} />
              <h4 style={{ fontSize: '1rem', color: '#F8FAFC', fontWeight: 600 }}>Studio Hours</h4>
            </div>
            <p style={{ fontSize: '0.96rem', color: '#CBD5E1', fontWeight: 600, marginBottom: '2px' }}>
              Monday – Sunday: 09:00 AM – 09:30 PM
            </p>
            <p style={{ fontSize: '0.82rem', color: '#10B981' }}>
              Open 7 days a week • Valet parking available
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', marginBottom: '8px' }}>
              <MapPin size={18} />
              <h4 style={{ fontSize: '1rem', color: '#F8FAFC', fontWeight: 600 }}>Studio Address</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.4 }}>
              Linking Road, Bandra West, Mumbai, Maharashtra 400050
            </p>
          </div>
        </div>
      </div>

      {/* STEP 1: Service Detail Modal (with multi-image slider and benefits) */}
      <ServiceDetailModal
        service={detailService}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onBookNow={(srv) => {
          setIsDetailOpen(false);
          handleStartBooking(srv);
        }}
      />

      {/* STEP 2: Choose Stylist Modal (with leave check and tel link) */}
      <StylistSelectModal
        service={selectedServiceForBooking}
        isOpen={isStylistSelectOpen}
        onClose={() => setIsStylistSelectOpen(false)}
        onSelectStylist={handleSelectStylist}
      />

      {/* STEP 3: Booking Summary Modal (direct booking confirmation - no slots) */}
      <BookingSummaryModal
        service={selectedServiceForBooking}
        stylist={selectedStylistForBooking}
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};
