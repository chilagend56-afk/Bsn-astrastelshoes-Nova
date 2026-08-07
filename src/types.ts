export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  specs: string;
  note?: string;
  rating: number;
  discount?: string;
  tag?: string;
}

export interface User {
  id: string;
  role: 'admin' | 'customer';
  name: string;
  email: string;
}
