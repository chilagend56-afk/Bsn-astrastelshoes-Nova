import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { Download } from 'lucide-react';

export const PreviewInvoice = () => {
  const [searchParams] = useSearchParams();
  const { settings } = useSystemSettings();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const oParam = searchParams.get('o');
      if (!oParam) {
        setError('Invalid invoice link');
        setLoading(false);
        return;
      }

      try {
        const decodedString = atob(oParam);
        const productsData = decodedString.split(',');
        
        const fetchedItems = [];
        
        for (const data of productsData) {
          const [id, qtyStr, priceStr] = data.split(':');
          if (!id || !qtyStr || !priceStr) continue;
          
          const qty = parseInt(qtyStr, 10);
          const price = parseFloat(priceStr);
          
          const { data: pData } = await supabase.from('products').select('*').eq('id', id).single();
          
          if (pData) {
            fetchedItems.push({
              product: pData,
              quantity: qty,
              price: price
            });
          }
        }
        
        setItems(fetchedItems);
      } catch (err) {
        console.error(err);
        setError('Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-[#E5E0D8]">
          <p className="text-red-500 font-medium mb-4">{error || 'No items found in this invoice'}</p>
        </div>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#F9F6F0] pb-24">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 pt-8">
        
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-[#E5E0D8] flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                {item.product.image || item.product.imageUrl ? (
                  <img src={item.product.image || item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-dark text-sm sm:text-base mb-1 line-clamp-2 uppercase tracking-wide">{item.product.name}</h3>
                <p className="text-gray-500 text-sm">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-[#25D366] text-lg">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#E8F5E9] p-6 rounded-2xl flex items-center justify-between border border-[#C8E6C9]">
          <span className="font-bold text-dark text-xl">Total Amount Due:</span>
          <span className="font-bold text-[#25D366] text-3xl">{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F9F6F0] via-[#F9F6F0] to-transparent print:hidden pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <button 
            onClick={() => window.print()}
            className="w-full bg-[#25D366] text-white py-4 rounded-full font-bold text-lg hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2"
          >
            <Download size={22} /> Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};
