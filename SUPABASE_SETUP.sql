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
VALUES ('system_config', 'Bsn-astrastelshoes', 1500, 'Astrastelshoes01@gmail.com', '+2349155410448', '10a kafayat Abdulrazaq lekki phase 1', false, '', 'Fancy Shoes & Glamour')
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  delivery_cost = EXCLUDED.delivery_cost,
  contact_email = EXCLUDED.contact_email,
  whatsapp_number = EXCLUDED.whatsapp_number,
  tagline = EXCLUDED.tagline;

-- 6. SEED INITIAL PRODUCTS
INSERT INTO products (name, brand, category, price, original_price, image, specs, tag, rating, discount)
VALUES
('Elegant Stiletto Heels', 'Astrastel', 'Heels', 45000, NULL, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop', 'Pink, 4 inch', NULL, 4.9, NULL),
('Comfortable Flats', 'Chic', 'Flats', 27000, NULL, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop', 'Black Leather', NULL, 5, NULL),
('Platform Sneakers', 'Sporty', 'Sneakers', 55000, NULL, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop', 'White, Size 38-42', NULL, 4.6, NULL),
('Strappy Evening Sandals', 'Glamour', 'Sandals', 68000, 75000, 'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000&auto=format&fit=crop', 'Silver, Strappy', 'HOT', 4.7, NULL),
('Kids Sparkle Shoes', 'Kids', 'Child Shoes', 25000, 30000, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop', 'Pink Sparkle', NULL, 4.9, NULL),
('Luxury Ankle Boots', 'Astrastel', 'Boots', 120000, NULL, 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1000&auto=format&fit=crop', 'Leather, Size 37-41', NULL, 4.8, NULL),
('Designer Crystal Heels', 'Astrastel', 'Heels', 165000, NULL, 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop', 'Crystal Embellished', 'HOT', 4.8, NULL);
