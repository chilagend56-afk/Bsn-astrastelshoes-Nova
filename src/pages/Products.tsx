import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/ui/ProductCard';
import { supabase } from '../lib/supabase';

import { mockProducts } from '../data/mock';
import { Smartphone, Laptop, Watch, Headphones, Cable, Gamepad, Grid, List, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

const availableCategories = [
  { name: 'All', icon: Grid },
  { name: 'Smartphones', icon: Smartphone },
  { name: 'iPhones', icon: Smartphone },
  { name: 'Samsung', icon: Smartphone },
  { name: 'Laptops', icon: Laptop },
  { name: 'Smart Watches', icon: Watch },
  { name: 'AirPods', icon: Headphones },
  { name: 'Accessories', icon: Cable },
];

export const Products = () => {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Sync route params or search params to local filters
  useEffect(() => {
    const routeCategory = categoryName 
      ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase() 
      : searchParams.get('category') || 'All';
    
    // Normalize some category names
    if (routeCategory.toLowerCase() === 'all') {
      setSelectedCategory('All');
    } else {
      setSelectedCategory(routeCategory);
    }

    const querySearch = searchParams.get('search') || '';
    setSearchQuery(querySearch);
  }, [categoryName, searchParams]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        
        let { data: list, error } = await supabase.from('products').select('*');
        if (error) throw error;
        
        // Fallback to mock products if DB has no products
        if (!list || list.length === 0) {
          list = mockProducts;
        }

        if (list && list.length > 0) {
          list = list.map((p: any) => ({
            ...p,
            originalPrice: p.original_price || p.originalPrice
          }));
        }
        setProducts(list);
      } catch (err) {
        console.error("Error fetching products", err);
        // Fallback to mock products on error
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.brand?.toLowerCase().includes(q) || 
        p.specs?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Update query params
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />

      <main className="flex-1 py-8 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-[22px] sm:text-3xl font-extrabold text-dark tracking-tight">
            {selectedCategory === 'All' ? 'Explore All Products' : `${selectedCategory}`}
          </h1>
          <p className="text-[14px] sm:text-base text-gray-500 mt-1 sm:mt-2">
            Discover quality mobile phones, laptops, and original accessories.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Horizontal Category selector for easy tapping */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {availableCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={14} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input inside products page */}
            <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 w-full sm:w-auto">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Filter results..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none ml-2 text-sm w-full sm:w-44"
              />
            </form>

            {/* Sort by Select */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600">
              <span>Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none font-bold text-dark cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid / View Area */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading products catalog...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto mt-8">
            <SlidersHorizontal size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dark mb-1">No products found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any products matching your current filters. Try resetting them!
            </p>
            <button 
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-light transition-all"
            >
              <RotateCcw size={16} /> Reset All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
