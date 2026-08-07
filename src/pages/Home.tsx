import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/ui/ProductCard';
import { mockProducts } from '../data/mock';
import { ShieldCheck, Zap, BadgeCheck, Truck, ChevronRight, Crown, Footprints, Sparkles, Heart, Star, Gem, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const categories = [
  { name: 'Heels', icon: Crown },
  { name: 'Flats', icon: Footprints },
  { name: 'Sandals', icon: Sparkles },
  { name: 'All Shoes', icon: Grid },
];

export const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        
        const { data: fetched, error } = await supabase
          .from('products')
          .select('*')
          .limit(50);
          
        if (error) throw error;
        
        if (fetched && fetched.length > 0) {
          const mapped = fetched.map(p => ({
            ...p,
            originalPrice: p.original_price
          }));
          setProducts(mapped);
        } else {
          setProducts(mockProducts);
        }
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-100 pt-8 sm:pt-16 pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl"
              >
                <h1 className="text-[36px] sm:text-5xl md:text-6xl font-bold text-dark tracking-tight leading-[1.1] mb-1 sm:mb-2">
                  Feel Good.
                </h1>
                <h1 className="text-[36px] sm:text-5xl md:text-6xl font-serif font-bold text-primary tracking-tight leading-[1.1] mb-4 sm:mb-6">
                  Spend Smart.
                </h1>
                <p className="text-[15px] sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md leading-relaxed">
                  Discover our exclusive collection of luxury footwear. From stunning heels to comfortable flats, find your perfect pair today.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                  <Link to="/products" className="bg-primary text-white px-8 py-3 sm:py-3.5 rounded-xl font-medium text-sm sm:text-base text-center hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all">
                    Shop Now
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
                    <div className="text-[10px] sm:text-xs leading-tight"><span className="block font-semibold text-dark">100% Secure</span><span className="text-gray-500">Safe shopping</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
                    <div className="text-[10px] sm:text-xs leading-tight"><span className="block font-semibold text-dark">Best Prices</span><span className="text-gray-500">Affordable deals</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
                    <div className="text-[10px] sm:text-xs leading-tight"><span className="block font-semibold text-dark">Verified Quality</span><span className="text-gray-500">Trusted devices</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
                    <div className="text-[10px] sm:text-xs leading-tight"><span className="block font-semibold text-dark">Fast Delivery</span><span className="text-gray-500">Nationwide</span></div>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[3rem] -rotate-3 scale-105"></div>
                <img 
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1400&auto=format&fit=crop" 
                  alt="Luxury Shoes" 
                  className="relative rounded-[2rem] shadow-2xl object-cover h-[500px] w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 sm:py-12 border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-nowrap overflow-x-auto gap-3 sm:gap-4 pb-2 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link 
                    key={category.name} 
                    to={`/category/${category.name.toLowerCase()}`}
                    className="flex flex-col items-center gap-2 sm:gap-3 min-w-[72px] sm:min-w-[100px] p-2 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group snap-center"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-700 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm transition-all">
                      <Icon size={20} strokeWidth={1.5} className="sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-600 group-hover:text-dark text-center leading-tight">{category.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-[22px] sm:text-2xl font-bold text-dark tracking-tight">Featured Products</h2>
            <Link to="/products" className="text-[15px] sm:text-sm font-medium text-primary flex items-center gap-1 hover:text-primary-light transition-colors">
              View All <ChevronRight size={14} className="sm:w-4 sm:h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
              {products.length > 0 ? products.map((product) => (
                <ProductCard key={product.id} product={product} />
              )) : (
                <div className="col-span-full text-center py-10 text-gray-500">No products available.</div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};
