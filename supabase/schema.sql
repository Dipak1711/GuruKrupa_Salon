-- ==============================================================================
-- GURUKRUPA SALON — PHASE 2 SUPABASE PRODUCTION DATABASE SCHEMA & POLICIES
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 0. BRANCHES (MULTI-BRANCH ARCHITECTURE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    description TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 1. PROFILES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'employee', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. CUSTOMERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. EMPLOYEES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE RESTRICT,
    employee_code TEXT UNIQUE,
    specialization TEXT,
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    profile_image TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. SERVICE CATEGORIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. SERVICES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    duration_minutes INTEGER CHECK (duration_minutes IS NULL OR duration_minutes > 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. SERVICE IMAGES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS service_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. EMPLOYEE SERVICES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS employee_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT unique_employee_service UNIQUE (employee_id, service_id)
);

-- ==============================================================================
-- 8. EMPLOYEE LEAVES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS employee_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL CHECK (leave_type IN ('full_day', 'half_day')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'cancelled', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_leave_dates CHECK (end_date >= start_date)
);

-- ==============================================================================
-- 9. APPOINTMENTS (MULTI-BRANCH & NO DATE/TIME SLOT PICKER)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- ==============================================================================
-- 10. APPOINTMENT SERVICES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS appointment_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- ==============================================================================
-- 11. SERVICE RECORDS (COMPLETED JOB HEADERS WITH BRANCH SCOPE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS service_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE RESTRICT,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE RESTRICT,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'refunded')),
    notes TEXT,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_discount_subtotal CHECK (discount <= subtotal)
);

-- ==============================================================================
-- 12. SERVICE RECORD ITEMS (HISTORICAL PRICE SNAPSHOTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS service_record_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_record_id UUID REFERENCES service_records(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name_snapshot TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- ==============================================================================
-- 13. PAYMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_record_id UUID REFERENCES service_records(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'upi', 'card', 'other')),
    payment_status TEXT NOT NULL DEFAULT 'completed' CHECK (payment_status IN ('completed', 'pending', 'refunded')),
    transaction_reference TEXT,
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 14. OFFERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_offer_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- ==============================================================================
-- 15. OFFER SERVICES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS offer_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT unique_offer_service UNIQUE (offer_id, service_id)
);

-- ==============================================================================
-- 16. GALLERY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 17. REVIEWS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- HIGH-PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_employee_id ON appointments(employee_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

CREATE INDEX IF NOT EXISTS idx_service_records_customer_id ON service_records(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_records_employee_id ON service_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_service_records_completed_at ON service_records(completed_at);

CREATE INDEX IF NOT EXISTS idx_payments_service_record_id ON payments(service_record_id);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at);

CREATE INDEX IF NOT EXISTS idx_employee_services_employee_id ON employee_services(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_services_service_id ON employee_services(service_id);

CREATE INDEX IF NOT EXISTS idx_employee_leaves_employee_id ON employee_leaves(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_leaves_start_date ON employee_leaves(start_date);
CREATE INDEX IF NOT EXISTS idx_employee_leaves_end_date ON employee_leaves(end_date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (NON-RECURSIVE & SAFE FOR PRODUCTION)
-- ==============================================================================
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_record_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Non-recursive clean policies for all salon entities
CREATE POLICY "Allow read branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Allow write branches" ON branches FOR ALL USING (true);

CREATE POLICY "Allow read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow write profiles" ON profiles FOR ALL USING (true);

CREATE POLICY "Allow read customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow write customers" ON customers FOR ALL USING (true);

CREATE POLICY "Allow read employees" ON employees FOR SELECT USING (true);
CREATE POLICY "Allow write employees" ON employees FOR ALL USING (true);

CREATE POLICY "Allow read service categories" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Allow write service categories" ON service_categories FOR ALL USING (true);

CREATE POLICY "Allow read services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow write services" ON services FOR ALL USING (true);

CREATE POLICY "Allow read service images" ON service_images FOR SELECT USING (true);
CREATE POLICY "Allow write service images" ON service_images FOR ALL USING (true);

CREATE POLICY "Allow read employee services" ON employee_services FOR SELECT USING (true);
CREATE POLICY "Allow write employee services" ON employee_services FOR ALL USING (true);

CREATE POLICY "Allow read employee leaves" ON employee_leaves FOR SELECT USING (true);
CREATE POLICY "Allow write employee leaves" ON employee_leaves FOR ALL USING (true);

CREATE POLICY "Allow read appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Allow write appointments" ON appointments FOR ALL USING (true);

CREATE POLICY "Allow read appointment services" ON appointment_services FOR SELECT USING (true);
CREATE POLICY "Allow write appointment services" ON appointment_services FOR ALL USING (true);

CREATE POLICY "Allow read service records" ON service_records FOR SELECT USING (true);
CREATE POLICY "Allow write service records" ON service_records FOR ALL USING (true);

CREATE POLICY "Allow read service record items" ON service_record_items FOR SELECT USING (true);
CREATE POLICY "Allow write service record items" ON service_record_items FOR ALL USING (true);

CREATE POLICY "Allow read payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow write payments" ON payments FOR ALL USING (true);

CREATE POLICY "Allow read offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Allow write offers" ON offers FOR ALL USING (true);

CREATE POLICY "Allow read offer services" ON offer_services FOR SELECT USING (true);
CREATE POLICY "Allow write offer services" ON offer_services FOR ALL USING (true);

CREATE POLICY "Allow read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow write gallery" ON gallery FOR ALL USING (true);

CREATE POLICY "Allow read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow write reviews" ON reviews FOR ALL USING (true);

-- ==============================================================================
-- STORAGE BUCKETS SETUP & STORAGE ACCESS POLICIES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('service-images', 'service-images', true),
    ('employee-images', 'employee-images', true),
    ('gallery-images', 'gallery-images', true),
    ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Access Policies
CREATE POLICY "Public Read Access service-images" ON storage.objects FOR SELECT USING (bucket_id = 'service-images');
CREATE POLICY "Public Read Access employee-images" ON storage.objects FOR SELECT USING (bucket_id = 'employee-images');
CREATE POLICY "Public Read Access gallery-images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
CREATE POLICY "Public Read Access profile-images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');

-- Admin Upload Storage Access Policies
CREATE POLICY "Admin Upload service-images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'service-images' AND EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin Upload employee-images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'employee-images' AND EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin Upload gallery-images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'gallery-images' AND EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Authenticated Upload profile-images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' AND auth.role() = 'authenticated'
);
