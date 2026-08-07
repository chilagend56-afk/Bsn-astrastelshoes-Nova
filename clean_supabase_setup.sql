-- Supabase Setup SQL

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Insert Settings
INSERT INTO settings (id, site_name, delivery_cost, contact_email, whatsapp_number, delivery_location, maintenance_mode, logo_url, tagline)
VALUES ('system_config', 'Bsn-astrastelshoes', 1500, 'Astrastelshoes01@gmail.com', '+2349155410448', '10a kafayat Abdulrazaq lekki phase 1', false, '', 'Fancy Shoes & Glamour')
ON CONFLICT (id) DO UPDATE SET
site_name = EXCLUDED.site_name, delivery_cost = EXCLUDED.delivery_cost, contact_email = EXCLUDED.contact_email, whatsapp_number = EXCLUDED.whatsapp_number, tagline = EXCLUDED.tagline;

-- Insert Products
INSERT INTO products (name, brand, category, price, original_price, image, specs, tag, rating, discount)
VALUES
('E-hub 50,000mah power bank ', 'E-Hub ', 'Accessories', 45000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('E-Hub 20,000 mah power bank ', 'E-HUB ', 'Accessories', 16000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Rexi 30,000mah power bank ', 'Rexi', 'Accessories', 27000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 5, NULL),
('Poolee 20,000mah power bank ', 'Poolee', 'Accessories', 16500, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Apple Watch Series 9', 'Apple', 'Smart Watches', 550000, NULL, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop', '45mm, GPS', NULL, 4.6, NULL),
('Linkco 30,000 mah power bank ', 'Linkco', 'Accessories', 30000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('New age 22,500mah power bank ', 'New age ', 'Accessories', 18500, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Oraimo Powerbox 40,000mAh 22.5W Fast Charging Power Bank', 'Oraimo Digital Display ', 'Accessories', 48000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('New age 12,500mah power bank ', 'New age ', 'Accessories', 17500, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Oraimo  27,000mAh 22.5W Fast Charging Power Bank', 'Oraimo digital display', 'Accessories', 35000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Linkco 50,000mah power bank ', 'Linkco ', 'Accessories', 50000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('New age 33,000mah power bank ', 'New age ', 'Accessories', 30000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black', NULL, 0, NULL),
('Samsung Galaxy S24 Ultra', 'Samsung', 'Smartphones', 1080000, 1227000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop', '512GB, 12GB RAM', NULL, 4.7, NULL),
('Itel star 10,000mah power bank ', 'Itel start ', 'Accessories', 10000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Oraimo 50,000mAh 285W Fast Charging Power Bank', 'Oraimo digital display ', 'Accessories', 72000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Flick 10,000mah power bank ', 'Flick ', 'Accessories', 11500, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('BK 10,000mah power bank ', 'BK', 'Accessories', 11000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Fire-fire 20,000 mah power bank ', 'Fire-fire', 'Accessories', 15000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Oraimo 60,000mah power bank ', 'Oraimo ', 'Accessories', 96000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Digifon mate2 20,000mah power bank ', 'Digifon mate2', 'Accessories', 25000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('MacBook Air M2', 'Apple', 'Laptops', 1250000, 1358000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop', '256GB SSD, 8GB RAM', NULL, 4.9, NULL),
('Fire-fast 45,000mah power bank', 'Fire-fast', 'Accessories', 50700, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('E-hub 30,000 power bank ', 'E-hub', 'Accessories', 25000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Oraimo PowerNova Q31 30,000mAh 22.5W Fast Charging Power Bank', 'Oraimo Digital Display', 'Accessories', 37500, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Rexi 40,000mah power bank ', 'Rexi ', 'Accessories', 35500, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('E-hub 10,000 mah power bank ', 'E-hub', 'Accessories', 10000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('New age 44,000mah power bank ', 'New age ', 'Accessories', 40000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('AirPods Pro 2', 'Apple', 'AirPods', 320000, NULL, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop', 'USB-C', NULL, 4.8, NULL),
('Menstrual Cramp Relief Belt', 'OME', 'Accessories', 15000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', '1.2', NULL, 0, NULL),
('Digifon GorillaXR 30,000mah power bank ', 'Digifon GorillaXR', 'Accessories', 50800, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Linkco 20,000mah power bank ', 'Linkco ', 'Accessories', 16000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Redmi 20,000mah power bank ', 'Redmi ', 'Accessories', 17000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Poolee 50,000 mah power bank ', 'Poolee ', 'Accessories', 80000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', '', NULL, 0, NULL),
('iPhone 15 Pro Max', 'Apple', 'iPhones', 1650000, NULL, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop', '256GB, Titanium Blue', 'HOT', 4.8, NULL),
('CAMON 50 Pro', 'Tecno', 'Smartphones', 520000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', '256GB/16GB RAM', NULL, 0, NULL),
('20w new age wireless power bank ', 'New age ', 'Accessories', 40950, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Oraimo Powerbox 40,000mAh 22.5W Fast Charging Power Bank', 'Digital Display ', 'Smartphones', 0, NULL, '', '', NULL, 0, NULL),
('Flick 40,000mah power bank ', 'Flick ', 'Accessories', 40800, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('New age 22,500mah tubor power bank ', 'New age tubor ', 'Accessories', 20500, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL),
('Rexi 20,000 mah power bank ', 'Rexi ', 'Accessories', 19000, NULL, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop', 'Black ', NULL, 0, NULL);
