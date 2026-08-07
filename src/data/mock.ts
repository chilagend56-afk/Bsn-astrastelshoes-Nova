import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Designer Crystal Heels',
    brand: 'Astrastel',
    category: 'Heels',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop',
    specs: 'Crystal Embellished',
    rating: 4.8,
    tag: 'HOT'
  },
  {
    id: 'p2',
    name: 'Luxury Ankle Boots',
    brand: 'Astrastel',
    category: 'Boots',
    price: 120000,
    originalPrice: 150000,
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1000&auto=format&fit=crop',
    specs: 'Leather, Size 37-41',
    rating: 4.8,
    discount: '-20%'
  },
  {
    id: 'p3',
    name: 'Elegant Stiletto Heels',
    brand: 'Astrastel',
    category: 'Heels',
    price: 45000,
    originalPrice: 50000,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
    specs: 'Pink, 4 inch',
    rating: 4.9,
    discount: '-10%'
  },
  {
    id: 'p4',
    name: 'Strappy Evening Sandals',
    brand: 'Glamour',
    category: 'Sandals',
    price: 68000,
    image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000&auto=format&fit=crop',
    specs: 'Silver, Strappy',
    rating: 4.7
  },
  {
    id: 'p5',
    name: 'Kids Sparkle Shoes',
    brand: 'Kids',
    category: 'Child Shoes',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop',
    specs: 'Pink Sparkle',
    rating: 4.9
  }
];
