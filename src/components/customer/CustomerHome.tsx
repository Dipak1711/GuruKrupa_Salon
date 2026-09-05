import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useAuth } from '../../context/AuthContext';
import { Service, Employee, Branch } from '../../types';
import { ServiceCard } from './ServiceCard';
import { ServiceDetailModal } from './ServiceDetailModal';
import { formatPrice } from '../../utils/currency';
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
  Copy,
  Check,
  Building2,
  Search,
  Bell,
  SlidersHorizontal,
  Leaf,
  Compass,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../common/EmptyState';

interface CustomerHomeProps {
  onNavigateToView: (view: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ onNavigateToView }) => {
  const { categories, services, employees, offers, gallery, reviews, branches, isLoading } = useSalonData();
  const { currentUser } = useAuth();
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

  const curatedFeaturedService = activeServices.length > 0 ? activeServices[0] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* ------------------------------------------------------------------------- */}
      {/* MOBILE-ONLY GREETING & SEARCH (< 768px) (MATCHING MOBILE SCREENSHOT)       */}
      {/* ------------------------------------------------------------------------- */}
      <div className="mobile-only-header-greeting" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: '1.65rem', color: '#171717', fontWeight: 700, lineHeight: 1.15 }}>
              Good morning, {currentUser ? currentUser.name.split(' ')[0] : 'James'}
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#6F6A62', marginTop: '2px' }}>
              Ready for your bespoke grooming session?
            </p>
          </div>

          <button
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#F1EDE6',
              border: '1px solid #E4DED4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8C6D18',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Bell size={18} />
          </button>
        </div>

        {/* Mobile Hero Card (Matching Mobile Reference Screenshot) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4DED4',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(23, 23, 23, 0.04)',
          }}
        >
          <div style={{ position: 'relative', height: '240px' }}>
            <img
              src="/luxury_salon_hero.jpg"
              alt="Refined Grooming"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0,0,0,0) 65%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                border: '1px solid #E4DED4',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#171717',
                letterSpacing: '0.06em',
              }}
            >
              BESPOKE EXPERIENCE
            </div>

            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
              <h2
                className="font-serif"
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                Refined Grooming. <br />
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#E7D18A' }}>Made Personal.</span>
              </h2>
            </div>
          </div>

          <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: '#6F6A62', lineHeight: 1.55, margin: 0 }}>
              Experience master barber craftsmanship in our quiet sanctuary spaces. Unhurried hospitality tailored to your individual rhythm.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const srvSection = document.getElementById('featured-services-section');
                  srvSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-gold"
                style={{
                  flex: 1.2,
                  padding: '12px 16px',
                  borderRadius: '9999px',
                  backgroundColor: '#D4AF37',
                  color: '#171717',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>Explore Services</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => onNavigateToView('booking')}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '9999px',
                  backgroundColor: '#F1EDE6',
                  border: 'none',
                  color: '#171717',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <MapPin size={14} color="#8C6D18" />
                <span>Find a Branch</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 1. DESKTOP HERO SECTION (MATCHING EXACT DESKTOP SCREENSHOT 1)              */}
      {/* ------------------------------------------------------------------------- */}
      <div
        className="glass-card hero-card desktop-only"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '28px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4DED4',
          boxShadow: '0 12px 40px rgba(23, 23, 23, 0.04)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          padding: '36px',
        }}
      >
        {/* Left Column: Brand Statement, CTAs & Curated Treatment Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 2,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(201, 162, 39, 0.12)',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                borderRadius: '9999px',
                padding: '5px 14px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#8C6D18',
                marginBottom: '20px',
                width: 'fit-content',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={13} color="#8C6D18" />
              <span>GURUKRUPA LUXURY GROOMING • EST. 2024</span>
            </div>

            <h1
              className="font-serif"
              style={{
                fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#171717',
                marginBottom: '18px',
                letterSpacing: '-0.01em',
              }}
            >
              Refined Grooming. <br />
              <span style={{ color: '#8C6D18', fontStyle: 'italic', fontWeight: 400 }}>Made Personal.</span>
            </h1>

            <p
              style={{
                fontSize: '0.96rem',
                color: '#6F6A62',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '490px',
              }}
            >
              Experience uncompromising master barbering for the modern gentleman. Bespoke styling, hot-towel straight razor treatments, and quiet private sanctuaries crafted for restorative focus.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}>
              <button
                onClick={() => {
                  const srvSection = document.getElementById('featured-services-section');
                  srvSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '13px 26px',
                  fontSize: '0.92rem',
                  minHeight: '48px',
                  borderRadius: '9999px',
                  backgroundColor: '#8C6D18',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(140, 109, 24, 0.25)',
                }}
              >
                <span>Explore Services</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => onNavigateToView('booking')}
                style={{
                  padding: '13px 24px',
                  fontSize: '0.92rem',
                  minHeight: '48px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4DED4',
                  color: '#171717',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Compass size={18} color="#8C6D18" />
                <span>Find a Branch</span>
              </button>
            </div>
          </div>

          {/* Today's Curated Treatment Card (Desktop Reference Screenshot Match) */}
          {curatedFeaturedService && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4DED4',
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: '0 4px 14px rgba(23, 23, 23, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(201, 162, 39, 0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8C6D18',
                    flexShrink: 0,
                  }}
                >
                  <Leaf size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9A7B1C', letterSpacing: '0.08em', display: 'block' }}>
                    TODAY'S CURATED TREATMENT
                  </span>
                  <h4 style={{ fontSize: '0.94rem', color: '#171717', fontWeight: 700, margin: '2px 0' }}>
                    {curatedFeaturedService.name}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#6F6A62' }}>
                    {formatPrice(curatedFeaturedService.price)} • {curatedFeaturedService.duration_mins} Mins bespoke care
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleViewDetails(curatedFeaturedService)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8C6D18',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>VIEW</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Hero Salon Sanctuary Photography (Stitch Desktop Match) */}
        <div
          style={{
            position: 'relative',
            minHeight: '380px',
            borderRadius: '24px',
            overflow: 'hidden',
          }}
        >
          <img
            src="/luxury_salon_hero.jpg"
            alt="GuruKrupa Flagship Sanctuary"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Top-Right Badge: ★ FLAGSHIP SANCTUARIES */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #E4DED4',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#171717',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <Star size={13} color="#8C6D18" fill="#8C6D18" />
            <span>FLAGSHIP SANCTUARIES</span>
          </div>

          {/* Bottom Overlay Card: Architectural Serenity */}
          <div
            style={{
              position: 'absolute',
              bottom: '18px',
              left: '18px',
              right: '18px',
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #E4DED4',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#171717' }}>Architectural Serenity</div>
              <div style={{ fontSize: '0.76rem', color: '#6F6A62', marginTop: '2px' }}>Warm walnut, ambient acoustics & single-origin refreshments</div>
            </div>

            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#73560E',
                backgroundColor: '#E6D7AD',
                padding: '4px 10px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              PURE COMFORT
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* CURATED OFFERINGS CATEGORY BAR                                            */}
      {/* ------------------------------------------------------------------------- */}
      <div id="featured-services-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Clean Category Pills Header & Horizontal Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#6F6A62', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              CURATED OFFERINGS
            </span>
            <span style={{ fontSize: '0.78rem', color: '#8C6D18', fontWeight: 700 }}>
              • {activeServices.length} Rituals
            </span>
          </div>
        </div>

        {/* Horizontal Category Scroll Pills */}
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              border: selectedCategory === 'all' ? '1px solid #8C6D18' : '1px solid #E4DED4',
              backgroundColor: selectedCategory === 'all' ? '#8C6D18' : '#FFFFFF',
              color: selectedCategory === 'all' ? '#FFFFFF' : '#171717',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minHeight: '44px',
              boxShadow: selectedCategory === 'all' ? '0 4px 14px rgba(140, 109, 24, 0.25)' : 'none',
            }}
          >
            All Services ({activeServices.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #8C6D18' : '1px solid #E4DED4',
                  backgroundColor: isSelected ? '#8C6D18' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#171717',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  minHeight: '44px',
                  boxShadow: isSelected ? '0 4px 14px rgba(140, 109, 24, 0.25)' : 'none',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Responsive Grid for Service Cards */}
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6F6A62' }}>
            <Sparkles size={24} color="#8C6D18" style={{ marginBottom: '12px' }} />
            <p>Loading live services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <EmptyState
            icon={<Scissors size={28} />}
            title="No Services Match Your Filter"
            description="Try clearing your search term or selecting another service category."
          />
        ) : (
          <div
            className="service-card-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
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

      {/* ------------------------------------------------------------------------- */}
      {/* FEATURED MASTER STYLISTS                                                  */}
      {/* ------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: '#8C6D18', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Resident Craftsmen
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: '#171717', fontWeight: 700 }}>
            Master Stylists
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6F6A62', marginTop: '2px' }}>
            Select your preferred specialist to view experience and initiate phone reservation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {employees
            .filter((e) => e.is_active)
            .map((emp) => (
              <div
                key={emp.id}
                className="glass-card"
                style={{
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4DED4',
                  borderRadius: '18px',
                }}
              >
                <img
                  src={emp.avatar_url}
                  alt={emp.name}
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #C9A227',
                    marginBottom: '14px',
                    boxShadow: '0 4px 14px rgba(201, 162, 39, 0.2)',
                  }}
                />
                <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 600 }}>
                  {emp.name}
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#8C6D18', fontWeight: 600, marginBottom: '6px' }}>
                  {emp.role_title}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#6F6A62', marginBottom: '16px' }}>
                  {emp.experience_years} Yrs Experience • ★ {emp.rating} ({emp.reviews_count})
                </span>

                <button
                  onClick={() => onNavigateToView('booking')}
                  className="btn-gold-outline"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.84rem' }}
                >
                  <Scissors size={14} color="#8C6D18" />
                  <span>Choose Artist at Branch</span>
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* EXCLUSIVE PRIVILEGES & OFFERS PREVIEW                                     */}
      {/* ------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#8C6D18', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Privilege Codes
            </span>
            <h2 className="font-serif" style={{ fontSize: '2rem', color: '#171717', fontWeight: 700 }}>
              Exclusive Offers & Savings
            </h2>
          </div>

          <button onClick={() => onNavigateToView('offers')} className="btn-gold-outline" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            <span>View All Privileges</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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
                borderRadius: '18px',
              }}
            >
              <img
                src={offer.banner_image}
                alt={offer.title}
                style={{ width: '88px', height: '88px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9A7B1C', backgroundColor: 'rgba(201, 162, 39, 0.15)', padding: '3px 9px', borderRadius: '6px' }}>
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
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                {copiedCode === offer.code ? <Check size={14} color="#16845B" /> : <Copy size={14} />}
                <span>{copiedCode === offer.code ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* CLIENT TESTIMONIALS & CONCIERGE INFORMATION                                */}
      {/* ------------------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '36px 28px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F1EDE6 100%)',
          border: '1px solid #E4DED4',
          borderRadius: '24px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          <span style={{ fontSize: '0.82rem', color: '#8C6D18', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
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
                <span style={{ fontSize: '0.78rem', color: '#8C6D18', fontWeight: 600 }}>{rev.service_name}</span>
              </div>
            </div>
          ))}
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
