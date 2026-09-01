-- ==============================================================================
-- GURUKRUPA SALON — PRODUCTION SEED DATA FOR DEMONSTRATION & TESTING
-- Multi-Branch Architecture (Branch 1: Bandra West & Branch 2: Juhu Residency)
-- Execute this script in Supabase SQL Editor AFTER executing schema.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEED BRANCHES
-- ------------------------------------------------------------------------------
INSERT INTO branches (id, name, code, address, phone, email, description, image_url, status)
VALUES
    ('b1111111-1111-1111-1111-111111111111', 'GuruKrupa Salon - Bandra Main Branch', 'BRANCH_1', 'Shop 4-5, Royal Grandeur Avenue, Linking Road, Bandra West, Mumbai, Maharashtra 400050', '+91 98230 12345', 'bandra@gurukrupasalon.com', 'Flagship luxury grooming studio offering precision hair sculpting, beard architecture, and gold peptide facials.', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80', 'active'),
    ('b2222222-2222-2222-2222-222222222222', 'GuruKrupa Salon - Juhu Residency Branch', 'BRANCH_2', 'Suite 12, Horizon Sea Face Towers, Juhu Tara Road, Mumbai, Maharashtra 400049', '+91 98230 54321', 'juhu@gurukrupasalon.com', 'Bespoke coastal stylist sanctuary with private grooming suites and organic scalp therapy.', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', 'active')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address, phone = EXCLUDED.phone;

-- ------------------------------------------------------------------------------
-- 2. SEED PROFILES & EMPLOYEES
-- ------------------------------------------------------------------------------
-- Branch 1 Stylists
WITH b1_prof1 AS (
    INSERT INTO profiles (full_name, email, phone, role, branch_id, avatar_url)
    VALUES ('Rahul Sharma', 'rahul.sharma@gurukrupasalon.com', '+91 98765 43210', 'employee', 'b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name RETURNING id
),
b1_emp1 AS (
    INSERT INTO employees (id, profile_id, branch_id, employee_code, specialization, experience_years, profile_image, status)
    SELECT 'e1111111-1111-1111-1111-111111111111', id, 'b1111111-1111-1111-1111-111111111111', 'EMP-101', 'Master Scissor Craft & Precision Skin Fades', 8, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'active' FROM b1_prof1
    ON CONFLICT (id) DO NOTHING
) SELECT 1;

WITH b1_prof2 AS (
    INSERT INTO profiles (full_name, email, phone, role, branch_id, avatar_url)
    VALUES ('Vikram Rajput', 'vikram.rajput@gurukrupasalon.com', '+91 98765 43211', 'employee', 'b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name RETURNING id
),
b1_emp2 AS (
    INSERT INTO employees (id, profile_id, branch_id, employee_code, specialization, experience_years, profile_image, status)
    SELECT 'e2222222-2222-2222-2222-222222222222', id, 'b1111111-1111-1111-1111-111111111111', 'EMP-102', 'Royal Beard Architecture & Japanese Feather Shaves', 10, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'active' FROM b1_prof2
    ON CONFLICT (id) DO NOTHING
) SELECT 1;

-- Branch 2 Stylists
WITH b2_prof1 AS (
    INSERT INTO profiles (full_name, email, phone, role, branch_id, avatar_url)
    VALUES ('Pooja Patil', 'pooja.patil@gurukrupasalon.com', '+91 98765 43212', 'employee', 'b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name RETURNING id
),
b2_emp1 AS (
    INSERT INTO employees (id, profile_id, branch_id, employee_code, specialization, experience_years, profile_image, status)
    SELECT 'e3333333-3333-3333-3333-333333333333', id, 'b2222222-2222-2222-2222-222222222222', 'EMP-201', '24K Gold Peptide Facial & Rejuvenating Aesthetics', 6, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'active' FROM b2_prof1
    ON CONFLICT (id) DO NOTHING
) SELECT 1;

WITH b2_prof2 AS (
    INSERT INTO profiles (full_name, email, phone, role, branch_id, avatar_url)
    VALUES ('Ananya Deshmukh', 'ananya.deshmukh@gurukrupasalon.com', '+91 98765 43213', 'employee', 'b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80')
    ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name RETURNING id
),
b2_emp2 AS (
    INSERT INTO employees (id, profile_id, branch_id, employee_code, specialization, experience_years, profile_image, status)
    SELECT 'e4444444-4444-4444-4444-444444444444', id, 'b2222222-2222-2222-2222-222222222222', 'EMP-202', 'Organic Hair Spa & Moroccan Keratin Steam Treatment', 7, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', 'active' FROM b2_prof2
    ON CONFLICT (id) DO NOTHING
) SELECT 1;

-- ------------------------------------------------------------------------------
-- 3. SEED SERVICE CATEGORIES & SERVICES
-- ------------------------------------------------------------------------------
INSERT INTO service_categories (id, name, description, image_url, status)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Hair Care & Scissor Craft', 'Precision haircutting, texturizing, and bespoke hair transformations', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'Beard Artistry & Shaving', 'Japanese feather blade wet shaves, contouring, and hot oil conditioning', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80', 'active'),
    ('33333333-3333-3333-3333-333333333333', 'Skin Care & Rejuvenation', 'Gold leaf peptide facials, charcoal detox, and deep pore exfoliation', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 'active'),
    ('44444444-4444-4444-4444-444444444444', 'Scalp Spa & Relaxation', 'Aromatherapy oil head massage, steam therapy, and tension release', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, category_id, name, description, price, duration_minutes, status)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Royal Signature Haircut', 'Precision scissor cut, hair wash with botanical shampoo, blowout styling, and matte pomade finish.', 350.00, 45, 'active'),
    ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Traditional Hot Towel Shave', 'Three-stage eucalyptus warm lather massage, Japanese feather blade shave, and cold post-shave splash.', 200.00, 30, 'active'),
    ('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Sculpted Beard Architecture & Styling', 'Custom beard shaping matching facial geometry, razor cheek line alignment, and organic beard balm treatment.', 250.00, 35, 'active'),
    ('a4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '24K Gold Luxury Skin Hydration', 'Ultrasonic pore cleansing, pure 24K gold foil peptide mask, collagen boost, and gemstone roller massage.', 1200.00, 60, 'active'),
    ('a5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Aromatherapy Herbal Scalp Spa', 'Hot organic coconut & lavender oil head massage, hair steam press, and scalp circulation treatment.', 600.00, 50, 'active')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. SEED SERVICE IMAGES
-- ------------------------------------------------------------------------------
INSERT INTO service_images (service_id, image_url, sort_order)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', 1),
    ('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80', 2),
    ('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80', 1),
    ('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80', 1),
    ('a4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 1);

-- ------------------------------------------------------------------------------
-- 5. SEED SAMPLE APPOINTMENTS (FOR BOTH BRANCHES)
-- ------------------------------------------------------------------------------
INSERT INTO appointments (id, branch_id, employee_id, status, notes, created_at, confirmed_at)
VALUES
    -- Branch 1 Appointments
    ('apt11111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'confirmed', 'Client requested skin fade with razor line.', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'),
    ('apt22222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'e2222222-2222-2222-2222-222222222222', 'pending', 'VIP hot towel shave & beard styling.', NOW() - INTERVAL '30 minutes', NULL),

    -- Branch 2 Appointments
    ('apt33333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'e3333333-3333-3333-3333-333333333333', 'confirmed', '24K Gold facial session.', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours'),
    ('apt44444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', 'e4444444-4444-4444-4444-444444444444', 'completed', 'Organic scalp massage & Keratin steam.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. SEED COMPLETED TRANSACTIONS & REVENUE (FOR BOTH BRANCHES)
-- ------------------------------------------------------------------------------
-- Branch 1 Service Record & Payment
INSERT INTO service_records (id, branch_id, employee_id, subtotal, discount, total_amount, payment_status, notes, completed_at)
VALUES 
    ('rec11111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 600.00, 50.00, 550.00, 'paid', 'Bandra Branch Signature Package Completed', NOW() - INTERVAL '3 hours'),
    ('rec22222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'e3333333-3333-3333-3333-333333333333', 1200.00, 150.00, 1050.00, 'paid', 'Juhu Residency Facial Special Completed', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_record_items (service_record_id, service_id, service_name_snapshot, quantity, unit_price, total_price)
VALUES 
    ('rec11111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Royal Signature Haircut', 1, 350.00, 350.00),
    ('rec11111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'Sculpted Beard Architecture & Styling', 1, 250.00, 250.00),
    ('rec22222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', '24K Gold Luxury Skin Hydration', 1, 1200.00, 1200.00);

INSERT INTO payments (service_record_id, amount, payment_method, payment_status, transaction_reference)
VALUES 
    ('rec11111-1111-1111-1111-111111111111', 550.00, 'upi', 'completed', 'UPI-BANDRA-98231'),
    ('rec22222-2222-2222-2222-222222222222', 1050.00, 'card', 'completed', 'CARD-JUHU-77123');

-- ------------------------------------------------------------------------------
-- 7. SEED OFFERS & REVIEWS
-- ------------------------------------------------------------------------------
INSERT INTO offers (name, description, discount_type, discount_value, start_date, end_date, status)
VALUES 
    ('ROYAL20', 'Get 20% OFF on all signature haircut and beard styling packages', 'percentage', 20.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'active'),
    ('GROOM150', 'Flat ₹150 privilege discount on 24K Gold Skin Hydration Facial', 'fixed', 150.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active');

INSERT INTO reviews (rating, comment, status)
VALUES 
    (5, 'Rahul Sharma at Bandra Main Branch is a true artisan. Immaculate fade and beard alignment!', 'approved'),
    (5, 'Pooja Patil at Juhu Residency performed the 24K Gold Facial. My skin was glowing for days.', 'approved'),
    (5, 'Seamless multi-branch appointment request. No time slot hassle or waiting queues!', 'approved');
