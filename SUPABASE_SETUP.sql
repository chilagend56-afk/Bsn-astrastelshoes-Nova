-- ========================================================
-- COMPLETE SUPABASE DATABASE SETUP FOR YOUNG DANGOTE
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ========================================================

-- 1. CREATE TABLES

-- Create Users table (linked to auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'customer',
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  brand TEXT,
  category TEXT,
  price NUMERIC,
  original_price NUMERIC,
  image TEXT,
  specs TEXT,
  tag TEXT,
  rating NUMERIC DEFAULT 0,
  discount TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  status TEXT DEFAULT 'pending',
  total_amount NUMERIC,
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Settings table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  site_name TEXT,
  delivery_cost NUMERIC,
  contact_email TEXT,
  whatsapp_number TEXT,
  delivery_location TEXT,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  logo_url TEXT,
  tagline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 3. DROP EXISTING POLICIES IF RE-RUNNING
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public read settings" ON settings;
DROP POLICY IF EXISTS "Admin full access products" ON products;
DROP POLICY IF EXISTS "Admin full access settings" ON settings;
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Admin full access orders" ON orders;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin full access users" ON users;

-- 4. CREATE RLS POLICIES
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access users" ON users FOR ALL USING (auth.role() = 'authenticated');

-- 5. SEED INITIAL SYSTEM SETTINGS
INSERT INTO settings (id, site_name, delivery_cost, contact_email, whatsapp_number, delivery_location, maintenance_mode, logo_url, tagline)
VALUES ('system_config', 'YOUNG DANGOTE', 1500, 'admin001@gmail.com', '08146516003', 'Port Harcourt', false, '', 'Smart device, SMARTER CHOICES')
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  delivery_cost = EXCLUDED.delivery_cost,
  contact_email = EXCLUDED.contact_email,
  whatsapp_number = EXCLUDED.whatsapp_number,
  tagline = EXCLUDED.tagline;

-- 6. SEED INITIAL PRODUCTS
INSERT INTO products (name, brand, category, price, original_price, image, specs, tag, rating, discount)
VALUES
('E-hub 50,000mah power bank', 'E-Hub', 'Accessories', 45000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black', NULL, 0, NULL),
('Rexi 30,000mah power bank', 'Rexi', 'Accessories', 27000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black', NULL, 5, NULL),
('Apple Watch Series 9', 'Apple', 'Smart Watches', 550000, NULL, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop', '45mm, GPS', NULL, 4.6, NULL),
('Samsung Galaxy S24 Ultra', 'Samsung', 'Smartphones', 1080000, 1227000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop', '512GB, 12GB RAM', 'HOT', 4.7, NULL),
('MacBook Air M2', 'Apple', 'Laptops', 1250000, 1358000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop', '256GB SSD, 8GB RAM', NULL, 4.9, NULL),
('AirPods Pro 2', 'Apple', 'AirPods', 320000, NULL, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop', 'USB-C', NULL, 4.8, NULL),
('iPhone 15 Pro Max', 'Apple', 'iPhones', 1650000, NULL, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop', '256GB, Titanium Blue', 'HOT', 4.8, NULL);
