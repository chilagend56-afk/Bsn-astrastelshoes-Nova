import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, ChevronDown, Truck, Moon, X, User, ShieldAlert, LogOut, Grid, Crown, Footprints, Zap, Sparkles, Heart } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { InstallPWA } from '../ui/InstallPWA';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../hooks/useCart';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';

const categories = [
  { name: 'Heels', path: '/category/heels', icon: Crown },
  { name: 'Flats', path: '/category/flats', icon: Footprints },
  { name: 'Sneakers', path: '/category/sneakers', icon: Zap },
  { name: 'Sandals', path: '/category/sandals', icon: Sparkles },
  { name: 'Child Shoes', path: '/category/child shoes', icon: Heart },
  { name: 'Other', path: '/category/other', icon: Grid },
];

export const Header = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { settings } = useSystemSettings();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
            {/* Top Banner */}
      <div className="bg-dark text-white text-xs py-2 text-center flex items-center justify-center gap-2 relative">
        <InstallPWA />
        <Truck size={14} />
        <span>Free delivery within {settings.deliveryLocation || 'Port Harcourt'}</span>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          <div className="scale-90 sm:scale-100 origin-left">
            <Logo />
          </div>

          {/* Search Bar Form */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-2xl items-center border border-gray-200 rounded-full bg-gray-50/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
          >
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-5 py-2.5 bg-transparent outline-none text-sm placeholder:text-gray-400" 
              placeholder="Search for elegant heels, comfy flats..." 
            />
            <button 
              type="button"
              onClick={() => setCatDropdownOpen(!catDropdownOpen)}
              className="border-l border-gray-200 px-4 py-2.5 bg-gray-50/50 text-sm text-gray-600 flex items-center gap-1 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              Categories <ChevronDown size={14} className="text-gray-400" />
            </button>
            <button type="submit" className="bg-primary text-white px-6 py-2.5 hover:bg-primary-light transition-colors flex items-center justify-center">
              <Search size={18} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/cart" className="flex items-center gap-2 text-dark hover:text-primary transition-colors relative">
              <div className="relative">
                <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">Cart</span>
            </Link>

            {/* User Profile & Dashboard shortcut for quick access */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2 border-l pl-4 border-gray-200">
                <Link 
                  to={'/admin'} 
                  className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-full font-bold transition-all"
                >
                  <User size={14} />
                  Admin Panel
                </Link>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden sm:flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-full font-semibold transition-all"
              >
                <User size={14} />
                Admin Login
              </Link>
            )}

            <button 
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 text-dark hover:text-primary transition-colors"
            >
              <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />
              <span className="text-sm font-medium hidden sm:block">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links Row */}
      <div className="hidden md:block border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 py-3 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setCatDropdownOpen(!catDropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-dark hover:text-primary shrink-0 relative"
            >
              <Grid size={16} /> Categories <ChevronDown size={14} className="text-gray-400" />
            </button>
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-600 shrink-0">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/products" className="hover:text-primary transition-colors">All Products</Link>
              <Link to="/products?category=Heels" className="hover:text-primary transition-colors">Heels</Link>
              <Link to="/products?category=Flats" className="hover:text-primary transition-colors">Flats</Link>
              <Link to="/products?category=Sneakers" className="hover:text-primary transition-colors">Sneakers</Link>
            </nav>
          </div>
        </div>

        {/* Categories Dropdown overlay */}
        {catDropdownOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setCatDropdownOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-10 h-10 bg-gray-50 group-hover:bg-primary/10 rounded-lg flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-dark">{cat.name}</h4>
                      <p className="text-[11px] text-gray-400">View Catalog</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Menu Drawer Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-xs z-50 flex justify-end">
          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setMenuOpen(false)}></div>
          
          {/* Drawer Content */}
          <div className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl relative">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <Logo />
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-dark transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Mobile Search input */}
              <form onSubmit={handleSearchSubmit} className="md:hidden flex items-center border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
                <Search size={16} className="text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none ml-2 text-sm w-full"
                  placeholder="Search products..." 
                />
              </form>

              {/* Navigation Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Navigation</h3>
                <div className="grid grid-cols-1 gap-1">
                  <Link to="/" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-xl text-dark font-medium hover:bg-gray-50 flex items-center justify-between">
                    Home <span>&rarr;</span>
                  </Link>
                  <Link to="/products" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-xl text-dark font-medium hover:bg-gray-50 flex items-center justify-between">
                    All Products <span>&rarr;</span>
                  </Link>
                  <Link to="/cart" onClick={() => setMenuOpen(false)} className="p-2.5 rounded-xl text-dark font-medium hover:bg-gray-50 flex items-center justify-between">
                    My Cart ({cartCount}) <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Categories Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={() => setMenuOpen(false)}
                      className="p-3 border border-gray-100 rounded-xl hover:bg-primary/5 hover:border-primary/20 text-center transition-all"
                    >
                      <h4 className="text-xs font-bold text-dark">{cat.name}</h4>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Admin/Seller access section (The Blocker Fixed!) */}
              <div className="space-y-3 border-t pt-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demo / Panel Access</h3>
                
                {user ? (
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Logged in as:</p>
                      <p className="text-sm font-bold text-dark">{user.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase">{user.role}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      <Link 
                        to={'/admin'} 
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-xl text-xs font-bold hover:bg-primary-light transition-all"
                      >
                        Go to Dashboard Panel
                      </Link>
                      
                      <button 
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <p className="text-xs text-gray-500">
                      Sign in as Admin to manage the store.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <Link 
                        to="/login" 
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center bg-dark text-white py-2.5 rounded-xl text-xs font-bold hover:bg-dark/90 transition-all"
                      >
                        Log In to Panel
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 text-center">
              <p className="text-xs text-gray-400 font-medium">Young Dangote Tech Hub &copy; 2026. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};