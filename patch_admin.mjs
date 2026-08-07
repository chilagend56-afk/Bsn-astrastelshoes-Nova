import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Fix product payload
content = content.replace(
/const productPayload = \{[\s\S]*?updatedAt: new Date\(\)\.toISOString\(\)\n\s*\};/,
`const productPayload = {
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        price: Number(productForm.price),
        image: productForm.image,
        specs: productForm.specs,
        updated_at: new Date().toISOString()
      };`
);

// Fix settings save
content = content.replace(
/await supabase\.from\('settings'\)\.upsert\(\{ id: 'system_config', \.\.\.systemSettings \}\); fetchData\(\);/,
`await supabase.from('settings').upsert({ 
        id: 'system_config', 
        site_name: systemSettings.siteName,
        delivery_cost: systemSettings.deliveryCost,
        contact_email: systemSettings.contactEmail,
        whatsapp_number: systemSettings.whatsappNumber,
        delivery_location: systemSettings.deliveryLocation,
        maintenance_mode: systemSettings.maintenanceMode,
        logo_url: systemSettings.logoUrl,
        tagline: systemSettings.tagline
      }); fetchData();`
);

// Fix settings fetch mapping
content = content.replace(
/setSystemSettings\(sData as any\);/,
`setSystemSettings({
          ...systemSettings,
          siteName: sData.site_name || '',
          deliveryCost: sData.delivery_cost || 0,
          contactEmail: sData.contact_email || '',
          whatsappNumber: sData.whatsapp_number || '',
          deliveryLocation: sData.delivery_location || '',
          maintenanceMode: sData.maintenance_mode || false,
          logoUrl: sData.logo_url || '',
          tagline: sData.tagline || ''
        });`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
