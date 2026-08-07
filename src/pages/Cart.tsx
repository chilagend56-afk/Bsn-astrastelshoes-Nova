import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../lib/utils';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useSystemSettings } from '../contexts/SystemSettingsContext';

import { formatWhatsAppNumber } from '../lib/whatsapp';

export const Cart = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { settings } = useSystemSettings();

  const handleWhatsAppOrder = () => {
    let message = `🚨 *NEW ORDER ALERTT!* 🚨\nHello ${settings.siteName}, I would like to place an order:\n\n`;
    
    let totalItems = items.length;
    let totalUnits = 0;
    
    const orderData = items.map(item => {
      totalUnits += item.quantity;
      message += `📦 *${item.product.name}*\n`;
      message += `   Qty: ${item.quantity}  |  ${formatCurrency(item.product.price)} each  |  Subtotal: ${formatCurrency(item.product.price * item.quantity)}\n\n`;
      return `${item.product.id}:${item.quantity}:${item.product.price}`;
    });
    
    message += `💰 *TOTAL: ${formatCurrency(total)}*  (${totalItems} items, ${totalUnits} units)\n\n`;
    
    const encodedData = btoa(orderData.join(','));
    const domain = 'https://bsn-astrastelshoes.vercel.app';
    
    message += `🧾 *View Invoice & Photos:*\n${domain}/preview?o=${encodedData}\n\n`;
    message += `Please confirm availability and delivery details. Thank you!`;
    
    const waNumber = settings.whatsappNumber || '08146516003';
    const cleanNumber = formatWhatsAppNumber(waNumber);
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-md w-full text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-6">
              <ShoppingBag size={40} />
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2 tracking-tight">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link 
              to="/products"
              className="w-full inline-flex items-center justify-center bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary-light transition-all"
            >
              Start Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-bold text-dark tracking-tight">Your Cart</h1>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              {items.length} items
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 flex gap-4 sm:gap-6 items-center sm:items-start shadow-sm">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl p-2 sm:p-4 shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.product.id}`} className="text-lg font-bold text-dark hover:text-primary transition-colors line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{item.product.specs}</p>
                      
                      <div className="mt-3 font-bold text-lg text-dark block sm:hidden">
                        {formatCurrency(item.product.price)}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="font-bold text-xl text-dark hidden sm:block">
                        {formatCurrency(item.product.price)}
                      </div>
                      
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-auto">
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 text-gray-500 hover:text-dark hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-medium text-dark text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 text-gray-500 hover:text-dark hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 sticky top-24 shadow-sm">
                <h2 className="text-xl font-bold text-dark mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-medium text-dark">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="font-medium text-dark">-</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-lg text-dark">Total</span>
                    <span className="font-bold text-2xl text-primary">{formatCurrency(total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right">VAT included where applicable</p>
                </div>
                
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} /> Order via WhatsApp
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>Secured by</span>
                  <span className="font-bold text-dark">WhatsApp Direct</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
