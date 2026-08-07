import { createClient } from '@supabase/supabase-js';
import { mockProducts } from './src/data/mock';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetProducts() {
  console.log('Fetching all products...');
  const { data: products, error: fetchError } = await supabase.from('products').select('id');
  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    return;
  }
  
  if (products && products.length > 0) {
    console.log(`Deleting ${products.length} existing products...`);
    const ids = products.map(p => p.id);
    const { error: deleteError } = await supabase.from('products').delete().in('id', ids);
    if (deleteError) {
      console.error('Error deleting products:', deleteError);
      return;
    }
  }
  
  console.log('Inserting new shoe products...');
  const { error: insertError } = await supabase.from('products').insert(
    mockProducts.map(p => ({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      original_price: p.originalPrice || null,
      image: p.image,
      specs: p.specs,
      tag: p.tag || null,
      rating: p.rating || 0
    }))
  );
  
  if (insertError) {
    console.error('Error inserting products:', insertError);
  } else {
    console.log('Successfully reset products to shoes.');
  }
}

resetProducts();
