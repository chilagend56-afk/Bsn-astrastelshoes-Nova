import { ShieldCheck, Tags, CheckCircle2, MessageCircle, Facebook, Twitter, Instagram } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { settings } = useSystemSettings();

  return (
    <footer className="bg-white border-t mt-16 pt-12">
      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700 border border-gray-100">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-dark">SHOP ANYWHERE</h4>
              <p className="text-xs text-gray-500 mt-0.5">Directly from us</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700 border border-gray-100">
              <Tags size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-dark">ADD TO CART</h4>
              <p className="text-xs text-gray-500 mt-0.5">Easy & simple</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700 border border-gray-100">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-dark">CHECKOUT</h4>
              <p className="text-xs text-gray-500 mt-0.5">Enter your name</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 border border-green-100">
              <MessageCircle size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-dark">REAL-TIME ALERTS</h4>
              <p className="text-xs text-gray-500 mt-0.5">We get instant updates</p>
            </div>
          </div>
        </div>

        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2 lg:pr-8">
            <Logo />
            <p className="text-[15px] text-gray-500 mt-6 leading-relaxed max-w-sm">
              {settings.aboutUsText || 'The premium boutique for elegant shoes, heels, and fashionable footwear.'}
            </p>
            <div className="flex items-center gap-3 mt-8">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all hover:-translate-y-1" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all hover:-translate-y-1" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all hover:-translate-y-1" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-dark tracking-wide uppercase text-sm mb-6">Categories</h4>
            <ul className="space-y-3.5 text-[15px] text-gray-500">
              <li><Link to="/products?category=Heels" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">Heels</Link></li>
              <li><Link to="/products?category=Flats" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">Flats</Link></li>
              <li><Link to="/products?category=Sandals" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">Sandals</Link></li>
              <li><Link to="/products" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">All Shoes</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-dark tracking-wide uppercase text-sm mb-6">Contact Us</h4>
            <ul className="space-y-4 text-[15px] text-gray-500">
              <li className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary transition-colors text-dark font-medium">{settings.contactEmail || 'admin001@gmail.com'}</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">WhatsApp</span>
                <a href={`https://wa.me/${settings.whatsappNumber}`} className="hover:text-primary transition-colors text-dark font-medium">{settings.whatsappNumber || '+2349155410448'}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-dark tracking-wide uppercase text-sm mb-6">Quick Links</h4>
            <ul className="space-y-3.5 text-[15px] text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-dark tracking-wide uppercase text-sm mb-6">Legal</h4>
            <ul className="space-y-3.5 text-[15px] text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-6 border-t border-gray-100 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} {settings.siteName || 'Bsn-astrastelshoes'}. All rights reserved.
      </div>
    </footer>
  );
};
