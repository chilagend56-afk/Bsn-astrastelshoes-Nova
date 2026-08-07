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

        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              {settings.aboutUsText || 'The premium boutique for elegant shoes, heels, and fashionable footwear from top designers.'}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                  <Facebook size={16} />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                  <Twitter size={16} />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                  <Instagram size={16} />
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-dark mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/products?category=Heels" className="hover:text-primary transition-colors">Heels</Link></li>
              <li><Link to="/products?category=Flats" className="hover:text-primary transition-colors">Flats</Link></li>
              <li><Link to="/products?category=Sneakers" className="hover:text-primary transition-colors">Sneakers</Link></li>
              <li><Link to="/products?category=Sandals" className="hover:text-primary transition-colors">Sandals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-dark mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="font-semibold">Email:</span>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary transition-colors">{settings.contactEmail || 'admin001@gmail.com'}</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold">WhatsApp:</span>
                <a href={`https://wa.me/${settings.whatsappNumber}`} className="hover:text-primary transition-colors">{settings.whatsappNumber || '+2349155410448'}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-dark mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-dark mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
              <li><a href="/login" className="hover:text-primary transition-colors">Admin Login</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-6 border-t border-gray-100 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} {settings.siteName || 'Young Dangote Tech Hub'}. All rights reserved.
      </div>
    </footer>
  );
};
