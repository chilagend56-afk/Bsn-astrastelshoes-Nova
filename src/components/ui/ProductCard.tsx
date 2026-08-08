import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col cursor-pointer h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[5/4] sm:aspect-square p-3 sm:p-6 bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
        {product.tag && (
          <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md uppercase tracking-wider z-10">
            {product.tag}
          </span>
        )}
        {product.discount && (
          <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md z-10">
            {product.discount}
          </span>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <div className="mb-1">
          <h3 className="font-semibold text-dark text-[15px] sm:text-base line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.specs}</p>
        </div>
        
        <div className="mt-2 sm:mt-3 mb-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-bold text-[16px] sm:text-lg text-dark leading-none">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[13px] sm:text-sm text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md w-fit shrink-0">
              <Star size={12} fill="currentColor" />
              {product.rating}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              added 
                ? 'bg-green-500 text-white shadow-md shadow-green-500/20' 
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
            }`}
          >
            <ShoppingCart size={16} />
            {added ? 'Added to Cart' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
