import fs from 'fs';

const fbData = JSON.parse(fs.readFileSync('fb_data.json', 'utf8'));
let sql = '-- Supabase Setup SQL\n\n';

sql += `-- Enable RLS\n`;
sql += `ALTER TABLE products ENABLE ROW LEVEL SECURITY;\n`;
sql += `ALTER TABLE orders ENABLE ROW LEVEL SECURITY;\n`;
sql += `ALTER TABLE users ENABLE ROW LEVEL SECURITY;\n`;
sql += `ALTER TABLE settings ENABLE ROW LEVEL SECURITY;\n\n`;

sql += `-- RLS Policies\n`;
sql += `CREATE POLICY "Public read products" ON products FOR SELECT USING (true);\n`;
sql += `CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);\n`;
sql += `CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');\n`;
sql += `CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (auth.role() = 'authenticated');\n`;
sql += `CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);\n`;
sql += `CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);\n`;
sql += `CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');\n`;
sql += `CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);\n`;
sql += `CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);\n`;
sql += `CREATE POLICY "Admin full access users" ON users FOR ALL USING (auth.role() = 'authenticated');\n\n`;

// Settings
if (fbData.settings) {
  const s = fbData.settings;
  const siteName = (s.siteName || 'Young Dangote Tech Hub').replace(/'/g, "''");
  const tagline = (s.tagline || 'Smart device, SMARTER CHOICES').replace(/'/g, "''");
  const logoUrl = (s.logoUrl && !s.logoUrl.startsWith('data:image')) ? s.logoUrl.replace(/'/g, "''") : '';
  const deliveryLoc = (s.deliveryLocation || 'Port Harcourt').replace(/'/g, "''");
  const contactEmail = (s.contactEmail || 'ydangote1@gmail.com').replace(/'/g, "''");
  const whatsapp = (s.whatsappNumber || '08146516003').replace(/'/g, "''");
  const deliveryCost = Number(s.deliveryCost) || 1500;
  
  sql += `-- Insert Settings\n`;
  sql += `INSERT INTO settings (id, site_name, delivery_cost, contact_email, whatsapp_number, delivery_location, maintenance_mode, logo_url, tagline)\n`;
  sql += `VALUES ('system_config', '${siteName}', ${deliveryCost}, '${contactEmail}', '${whatsapp}', '${deliveryLoc}', false, '${logoUrl}', '${tagline}')\n`;
  sql += `ON CONFLICT (id) DO UPDATE SET\n`;
  sql += `site_name = EXCLUDED.site_name, delivery_cost = EXCLUDED.delivery_cost, contact_email = EXCLUDED.contact_email, whatsapp_number = EXCLUDED.whatsapp_number, tagline = EXCLUDED.tagline;\n\n`;
}

// Products
if (fbData.products && fbData.products.length > 0) {
  sql += `-- Insert Products\n`;
  sql += `INSERT INTO products (name, brand, category, price, original_price, image, specs, tag, rating, discount)\nVALUES\n`;
  
  const values = [];
  for (const p of fbData.products) {
    const name = (p.name || '').replace(/'/g, "''");
    const brand = (p.brand || '').replace(/'/g, "''");
    const category = (p.category || '').replace(/'/g, "''");
    const price = Number(p.price) || 0;
    const origPrice = p.originalPrice ? Number(p.originalPrice) : 'NULL';
    let image = (p.image || p.imageUrl || '').replace(/'/g, "''");
    if (image.startsWith('data:image')) {
       image = 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop';
    }
    const specs = (p.specs || '').replace(/'/g, "''");
    const tag = p.tag ? `'${p.tag.replace(/'/g, "''")}'` : 'NULL';
    const rating = Number(p.rating) || 0;
    const discount = p.discount ? `'${p.discount.replace(/'/g, "''")}'` : 'NULL';
    
    values.push(`('${name}', '${brand}', '${category}', ${price}, ${origPrice}, '${image}', '${specs}', ${tag}, ${rating}, ${discount})`);
  }
  sql += values.join(',\n') + ';\n';
}

fs.writeFileSync('clean_supabase_setup.sql', sql);
console.log('Generated clean_supabase_setup.sql');
