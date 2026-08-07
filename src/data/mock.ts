import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'iPhones',
    price: 1650000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    specs: '256GB, Titanium Blue',
    rating: 4.8,
    tag: 'HOT'
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 1080000,
    originalPrice: 1227000,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
    specs: '512GB, 12GB RAM',
    rating: 4.7,
    discount: '-12%'
  },
  {
    id: 'p3',
    name: 'MacBook Air M2',
    brand: 'Apple',
    category: 'Laptops',
    price: 1250000,
    originalPrice: 1358000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
    specs: '256GB SSD, 8GB RAM',
    rating: 4.9,
    discount: '-8%'
  },
  {
    id: 'p4',
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    category: 'Smart Watches',
    price: 550000,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop',
    specs: '45mm, GPS',
    rating: 4.6
  },
  {
    id: 'p5',
    name: 'AirPods Pro 2',
    brand: 'Apple',
    category: 'AirPods',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop',
    specs: 'USB-C',
    rating: 4.8
  }
];
