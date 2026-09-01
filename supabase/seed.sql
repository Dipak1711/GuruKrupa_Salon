-- ==============================================================================
-- GURUKRUPA SALON — PRODUCTION SEED DATA FOR DEMONSTRATION
-- Valid Hexadecimal UUIDs only (0-9, a-f)
-- Multi-branch dataset: Branches, Customers, Stylists, Services,
-- Appointments, Completed Sales Records, Payments, Offers, Gallery & Reviews.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEED BRANCHES (Valid Hex UUIDs: 11111111-... and 22222222-...)
-- ------------------------------------------------------------------------------
INSERT INTO branches (id, name, code, address, phone, email, description, image_url, status)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'GuruKrupa Salon - Bandra Main Branch', 'BRANCH_1', 'Shop 4-5, Royal Grandeur Avenue, Linking Road, Bandra West, Mumbai, Maharashtra 400050', '+91 98230 12345', 'bandra@gurukrupasalon.com', 'Flagship luxury grooming studio offering precision hair sculpting, beard architecture, and gold peptide facials.', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'GuruKrupa Salon - Juhu Residency Branch', 'BRANCH_2', 'Suite 12, Horizon Sea Face Towers, Juhu Tara Road, Mumbai, Maharashtra 400049', '+91 98230 54321', 'juhu@gurukrupasalon.com', 'Bespoke coastal stylist sanctuary with private grooming suites and organic scalp therapy.', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', 'active')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. SEED PROFILES (Valid Hex UUIDs: 10000000-0000-0000-0000-000000000001+)
-- ------------------------------------------------------------------------------
INSERT INTO profiles (id, full_name, email, phone, role, branch_id, avatar_url)
VALUES
    -- Stylists
    ('10000000-0000-0000-0000-000000000001', 'Rahul Sharma', 'rahul.sharma@gurukrupasalon.com', '+91 98765 43210', 'employee', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    ('10000000-0000-0000-0000-000000000002', 'Vikram Rajput', 'vikram.rajput@gurukrupasalon.com', '+91 98765 43211', 'employee', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
    ('10000000-0000-0000-0000-000000000003', 'Pooja Patil', 'pooja.patil@gurukrupasalon.com', '+91 98765 43212', 'employee', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'),
    ('10000000-0000-0000-0000-000000000004', 'Ananya Deshmukh', 'ananya.deshmukh@gurukrupasalon.com', '+91 98765 43213', 'employee', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'),
    -- Customers
    ('10000000-0000-0000-0000-000000000005', 'Aditya Sonawane', 'aditya.sonawane@example.com', '+91 98112 23344', 'customer', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
    ('10000000-0000-0000-0000-000000000006', 'Sneha Kulkarni', 'sneha.kulkarni@example.com', '+91 98223 34455', 'customer', NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'),
    ('10000000-0000-0000-0000-000000000007', 'Rohan Mehta', 'rohan.mehta@example.com', '+91 98334 45566', 'customer', NULL, 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'),
    ('10000000-0000-0000-0000-000000000008', 'Priya Sharma', 'priya.sharma@example.com', '+91 98445 56677', 'customer', NULL, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'),
    ('10000000-0000-0000-0000-000000000009', 'Amit Joshi', 'amit.joshi@example.com', '+91 98556 67788', 'customer', NULL, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. SEED EMPLOYEES & CUSTOMERS (Valid Hex UUIDs: 20000000-... and 30000000-...)
-- ------------------------------------------------------------------------------
INSERT INTO employees (id, profile_id, branch_id, employee_code, specialization, experience_years, profile_image, status)
VALUES
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'EMP-101', 'Master Scissor Craft & Precision Skin Fades', 8, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'active'),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'EMP-102', 'Royal Beard Architecture & Japanese Feather Shaves', 10, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'active'),
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'EMP-201', '24K Gold Peptide Facial & Rejuvenating Aesthetics', 6, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'active'),
    ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'EMP-202', 'Organic Hair Spa & Moroccan Keratin Steam Treatment', 7, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, profile_id)
VALUES
    ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005'),
    ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006'),
    ('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007'),
    ('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008'),
    ('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. SEED SERVICE CATEGORIES & SERVICES
-- ------------------------------------------------------------------------------
INSERT INTO service_categories (id, name, description, image_url, status)
VALUES 
    ('40000000-0000-0000-0000-000000000001', 'Hair Care & Scissor Craft', 'Precision haircutting, texturizing, and bespoke hair transformations', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80', 'active'),
    ('40000000-0000-0000-0000-000000000002', 'Beard Artistry & Shaving', 'Japanese feather blade wet shaves, contouring, and hot oil conditioning', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80', 'active'),
    ('40000000-0000-0000-0000-000000000003', 'Skin Care & Rejuvenation', 'Gold leaf peptide facials, charcoal detox, and deep pore exfoliation', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 'active'),
    ('40000000-0000-0000-0000-000000000004', 'Scalp Spa & Relaxation', 'Aromatherapy oil head massage, steam therapy, and tension release', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, category_id, name, description, price, duration_minutes, status)
VALUES 
    ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Royal Signature Haircut', 'Precision scissor cut, hair wash with botanical shampoo, blowout styling, and matte pomade finish.', 350.00, 45, 'active'),
    ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'Traditional Hot Towel Shave', 'Three-stage eucalyptus warm lather massage, Japanese feather blade shave, and cold post-shave splash.', 200.00, 30, 'active'),
    ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002', 'Sculpted Beard Architecture & Styling', 'Custom beard shaping matching facial geometry, razor cheek line alignment, and organic beard balm treatment.', 250.00, 35, 'active'),
    ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000003', '24K Gold Luxury Skin Hydration', 'Ultrasonic pore cleansing, pure 24K gold foil peptide mask, collagen boost, and gemstone roller massage.', 1200.00, 60, 'active'),
    ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000004', 'Aromatherapy Herbal Scalp Spa', 'Hot organic coconut & lavender oil head massage, hair steam press, and scalp circulation treatment.', 600.00, 50, 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_images (service_id, image_url, sort_order)
VALUES 
    ('50000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', 1),
    ('50000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80', 2),
    ('50000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80', 1),
    ('50000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80', 1),
    ('50000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 1);

-- ------------------------------------------------------------------------------
-- 5. SEED APPOINTMENTS (Valid Hex UUIDs: 60000000-...)
-- ------------------------------------------------------------------------------
INSERT INTO appointments (id, branch_id, customer_id, employee_id, status, notes, created_at, confirmed_at, completed_at)
VALUES
    -- Branch 1 Appointments
    ('60000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 'completed', 'Aditya Sonawane - Haircut & Fade', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours'),
    ('60000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', 'confirmed', 'Sneha Kulkarni - VIP Hot Towel Shave & Styling', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', NULL),
    ('60000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000001', 'pending', 'Rohan Mehta - Haircut request', NOW() - INTERVAL '15 minutes', NULL, NULL),

    -- Branch 2 Appointments
    ('60000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', '30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000003', 'completed', 'Priya Sharma - 24K Gold Facial', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours', NOW() - INTERVAL '22 hours'),
    ('60000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', '30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000004', 'confirmed', 'Amit Joshi - Scalp Spa & Keratin', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', NULL)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. SEED SERVICE RECORDS & PAYMENTS (Valid Hex UUIDs: 70000000-...)
-- ------------------------------------------------------------------------------
INSERT INTO service_records (id, branch_id, appointment_id, customer_id, customer_name, customer_phone, employee_id, subtotal, discount, total_amount, payment_status, notes, completed_at)
VALUES 
    ('70000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000005', 'Aditya Sonawane', '+91 98112 23344', '20000000-0000-0000-0000-000000000001', 600.00, 50.00, 550.00, 'paid', 'Bandra Branch Signature Package Completed', NOW() - INTERVAL '2 hours'),
    ('70000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', '60000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000008', 'Priya Sharma', '+91 98445 56677', '20000000-0000-0000-0000-000000000003', 1200.00, 150.00, 1050.00, 'paid', 'Juhu Residency Facial Special Completed', NOW() - INTERVAL '22 hours')
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_record_items (service_record_id, service_id, service_name_snapshot, quantity, unit_price, total_price)
VALUES 
    ('70000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Royal Signature Haircut', 1, 350.00, 350.00),
    ('70000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000003', 'Sculpted Beard Architecture & Styling', 1, 250.00, 250.00),
    ('70000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000004', '24K Gold Luxury Skin Hydration', 1, 1200.00, 1200.00);

INSERT INTO payments (service_record_id, amount, payment_method, payment_status, transaction_reference)
VALUES 
    ('70000000-0000-0000-0000-000000000001', 550.00, 'upi', 'completed', 'UPI-BANDRA-98231'),
    ('70000000-0000-0000-0000-000000000002', 1050.00, 'card', 'completed', 'CARD-JUHU-77123');

-- ------------------------------------------------------------------------------
-- 7. SEED OFFERS, GALLERY & REVIEWS
-- ------------------------------------------------------------------------------
INSERT INTO offers (name, description, discount_type, discount_value, start_date, end_date, status)
VALUES 
    ('ROYAL20', 'Get 20% OFF on all signature haircut and beard styling packages', 'percentage', 20.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'active'),
    ('GROOM150', 'Flat ₹150 privilege discount on 24K Gold Skin Hydration Facial', 'fixed', 150.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active');

INSERT INTO gallery (title, category, image_url, description, status)
VALUES 
    ('Precision Razor Fade', 'Haircut', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', 'Bespoke skin fade with razor cheek line alignment', 'active'),
    ('Royal Hot Towel Wet Shave', 'Beard', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80', 'Japanese feather blade wet shave with warm eucalyptus towel', 'active'),
    ('24K Gold Skin Hydration', 'Facial', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 'Pure 24K gold foil peptide mask and gemstone roller treatment', 'active');

INSERT INTO reviews (rating, comment, status)
VALUES 
    (5, 'Rahul Sharma at Bandra Main Branch is a true artisan. Immaculate fade and beard alignment!', 'approved'),
    (5, 'Pooja Patil at Juhu Residency performed the 24K Gold Facial. My skin was glowing for days.', 'approved'),
    (5, 'Seamless multi-branch appointment request. No time slot hassle or waiting queues!', 'approved');
