import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { formatCurrency } from '../lib/utils';
import { ShieldCheck, Star, ShoppingCart, Share2, Check, ShieldAlert, Zap } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import { supabase } from '../lib/supabase';

import { useCart } from '../hooks/useCart';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { formatWhatsAppNumber } from '../lib/whatsapp';

export const ProductDetails = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { settings } = useSystemSettings();
  
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    
    let message = `🛍 *NEW ORDER ALERTT!* 🛍\nHello ${settings.siteName}, I would like to place an order:\n\n`;
    
    message += `📦 *${product.name}*\n`;
    message += `   Qty: 1  |  ${formatCurrency(product.price)} each  |  Subtotal: ${formatCurrency(product.price)}\n\n`;
    
    message += `💰 *TOTAL: ${formatCurrency(product.price)}*  (1 items, 1 units)\n\n`;
    
    const encodedData = btoa(`${product.id}:1:${product.price}`);
    const domain = 'https://bsn-astrastelshoes.web.app';
    
    message += `🧾 *View Invoice & Photos:*\n${domain}/preview?o=${encodedData}\n\n`;
    message += `Please confirm availability and delivery details. Thank you!`;
    
    const waNumber = settings.whatsappNumber || '08146516003';
    const cleanNumber = formatWhatsAppNumber(waNumber);
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const { data: pData, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (pData && !error) {
          setProduct(pData);
          
          // Fetch related products
          const { data: relData } = await supabase
            .from('products')
            .select('*')
            .eq('category', pData.category)
            .limit(4);
            
          if (relData) {
            setRelatedProducts(relData.filter(p => p.id !== pData.id));
          }
        }
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <Header />
        <main className="flex-1 py-16 text-center">Loading product details...</main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <Header />
        <main className="flex-1 py-16 text-center">Product not found.</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-primary">{product.category}</Link>
            <span>/</span>
            <span className="text-dark font-medium truncate">{product.name}</span>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-8 relative overflow-hidden group cursor-zoom-in">
                  {product.discount && (
                    <span className="absolute top-6 left-6 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg z-10">
                      {product.discount}
                    </span>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-125"
                  />
                </div>
                {/* Thumbnails placeholder */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 border-2 border-primary p-2 cursor-pointer shrink-0">
                    <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  {[1,2,3].map(i => (
                    <div key={i} className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 p-2 cursor-pointer shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                       <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply grayscale" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-dark mb-3 tracking-tight">
                    {product.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 font-medium text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-md">
                      <Star size={14} fill="currentColor" /> {product.rating || '0.0'}
                    </div>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">Brand: <span className="font-semibold text-dark">{product.brand}</span></span>
                    <span className="text-gray-400">|</span>
                    <span className="text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded-md">
                      <Check size={14} /> In Stock
                    </span>
                  </div>
                </div>

                <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-dark tracking-tight">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <ShieldCheck size={14} className="text-green-500" /> Includes 1 Year Warranty
                  </p>
                </div>

                {/* Key Specs */}
                <div className="mb-8">
                  <h3 className="font-semibold text-dark mb-4">Key Specifications</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-gray-500 block mb-1 text-xs uppercase tracking-wider font-semibold">Storage / Specs</span>
                      <span className="font-medium text-dark">{product.specs || 'N/A'}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-gray-500 block mb-1 text-xs uppercase tracking-wider font-semibold">Condition</span>
                      <span className="font-medium text-dark">Brand New</span>
                    </div>
                  </div>
                </div>

                {product.note && (
                  <div className="mb-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <h3 className="font-semibold text-dark mb-2 text-sm">Product Note</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.note}</p>
                  </div>
                )}

                <div className="mt-auto space-y-4 pt-8 border-t border-gray-100">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        addToCart(product);
                        setAdded(true);
                        setTimeout(() => setAdded(false), 2000);
                      }}
                      className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                        added 
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20' 
                          : 'bg-primary hover:bg-primary-light text-white shadow-primary/20'
                      }`}
                    >
                      <ShoppingCart size={20} />
                      {added ? 'Added to Cart! ✓' : 'Add to Cart'}
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Product link copied to clipboard!");
                      }}
                      className="px-6 py-4 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full flex py-4 rounded-xl font-semibold text-lg transition-all items-center justify-center gap-2 shadow-lg bg-[#25D366] hover:bg-[#128C7E] text-white shadow-[#25D366]/20 mt-4"
                  >
                    <ShoppingCart size={20} />
                    Order via WhatsApp
                  </button>

                </div>

              </div>
            </div>
            
            {/* Full Description & Specs Tabs (Simplified) */}
            <div className="mt-16 pt-16 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-dark mb-6">Product Information</h2>
              <div className="prose max-w-none text-gray-600">
                <p>
                  Step out in elegance and comfort with the {product.name}. 
                  Featuring advanced materials, stunning aesthetic quality, and a pro-grade finish.
                  This footwear is meticulously crafted to meet the highest standards of quality, style, and design.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>Incredible comfort for smooth all-day walking</li>
                  <li>Durable build with high-quality materials</li>
                  <li>Premium design for elegance and confidence</li>
                  <li>Advanced support for your daily activities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 sm:mt-16">
              <h2 className="text-xl sm:text-2xl font-bold text-dark mb-6 sm:mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
