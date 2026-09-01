-- ==============================================================================
-- GURUKRUPA SALON — INITIAL SEED DATA FOR SUPABASE
-- Execute this script in Supabase SQL Editor after running schema.sql
-- Note: All UUIDs must contain valid hexadecimal characters (0-9, a-f)
-- ==============================================================================

-- 1. SEED PROFILES & EMPLOYEES
WITH new_profiles AS (
    INSERT INTO profiles (full_name, email, phone, role, avatar_url)
    VALUES 
        ('Rahul Sharma', 'rahul.sharma@gurukrupasalon.com', '+91 98765 43210', 'employee', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
        ('Vikram Rajput', 'vikram.rajput@gurukrupasalon.com', '+91 98765 43211', 'employee', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
        ('Pooja Patil', 'pooja.patil@gurukrupasalon.com', '+91 98765 43212', 'employee', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'),
        ('Ananya Deshmukh', 'ananya.deshmukh@gurukrupasalon.com', '+91 98765 43213', 'employee', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80')
    RETURNING id, full_name, email, phone, avatar_url
)
INSERT INTO employees (profile_id, employee_code, specialization, experience_years, profile_image, status)
SELECT 
    id,
    'EMP-' || ROW_NUMBER() OVER(),
    CASE 
        WHEN full_name LIKE 'Rahul%' THEN 'Master Hair Scissoring & Precision Fades'
        WHEN full_name LIKE 'Vikram%' THEN 'Royal Beard Architecture & Hot Towel Wet Shaves'
        WHEN full_name LIKE 'Pooja%' THEN '24K Gold Facial & Rejuvenating Skin Aesthetics'
        ELSE 'Organic Hair Steam & Moroccan Keratin Rebirth'
    END,
    CASE WHEN full_name LIKE 'Rahul%' THEN 8 WHEN full_name LIKE 'Vikram%' THEN 10 ELSE 6 END,
    avatar_url,
    'active'
FROM new_profiles;

-- 2. SEED SERVICE CATEGORIES (Valid Hexadecimal UUIDs)
INSERT INTO service_categories (id, name, description, image_url, status)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Hair Care & Scissor Craft', 'Precision haircutting, texturizing, and bespoke hair transformations', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'Beard Artistry & Shaving', 'Japanese feather blade wet shaves, contouring, and hot oil conditioning', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80', 'active'),
    ('33333333-3333-3333-3333-333333333333', 'Skin Care & Rejuvenation', 'Gold leaf peptide facials, charcoal detox, and deep pore exfoliation', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 'active'),
    ('44444444-4444-4444-4444-444444444444', 'Scalp Spa & Relaxation', 'Aromatherapy oil head massage, steam therapy, and tension release', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', 'active');

-- 3. SEED SERVICES (Valid Hexadecimal UUIDs)
INSERT INTO services (id, category_id, name, description, price, duration_minutes, status)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Royal Signature Haircut', 'Precision scissor cut, hair wash with botanical shampoo, blowout styling, and matte pomade finish.', 350.00, 45, 'active'),
    ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Traditional Hot Towel Shave', 'Three-stage eucalyptus warm lather massage, Japanese feather blade shave, and cold post-shave splash.', 200.00, 30, 'active'),
    ('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Sculpted Beard Architecture & Styling', 'Custom beard shaping matching facial geometry, razor cheek line alignment, and organic beard balm treatment.', 250.00, 35, 'active'),
    ('a4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '24K Gold Luxury Skin Hydration', 'Ultrasonic pore cleansing, pure 24K gold foil peptide mask, collagen boost, and gemstone roller massage.', 1200.00, 60, 'active'),
    ('a5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Aromatherapy Herbal Scalp Spa', 'Hot organic coconut & lavender oil head massage, hair steam press, and scalp circulation treatment.', 600.00, 50, 'active');

-- 4. SEED SERVICE IMAGES
INSERT INTO service_images (service_id, image_url, sort_order)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', 1),
    ('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80', 2),
    ('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80', 1),
    ('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80', 1),
    ('a4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 1);

-- 5. SEED OFFERS
INSERT INTO offers (name, description, discount_type, discount_value, start_date, end_date, status)
VALUES 
    ('ROYAL20', 'Get 20% OFF on all signature haircut and beard styling packages', 'percentage', 20.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'active'),
    ('GROOM150', 'Flat ₹150 privilege discount on 24K Gold Skin Hydration Facial', 'fixed', 150.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active');

-- 6. SEED REVIEWS
INSERT INTO reviews (rating, comment, status)
VALUES 
    (5, 'Rahul Sharma is a true artisan. The fade and beard alignment were immaculate. Best salon in Mumbai!', 'approved'),
    (5, 'The 24K Gold Facial by Pooja is pure luxury. My skin was glowing for days.', 'approved'),
    (5, 'No waiting time or slot hassle. Seamless booking and master-level service.', 'approved');
