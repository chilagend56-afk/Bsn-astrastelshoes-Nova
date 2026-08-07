-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- Allow public read access to settings
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Allow all operations for authenticated users (Admin) on products
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Allow all operations for authenticated users (Admin) on settings
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Allow users to read and insert their own orders
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- Allow users to read and update their own user profile
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access users" ON users FOR ALL USING (auth.role() = 'authenticated');
