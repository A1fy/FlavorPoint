export enum Screen {
  Home = 'Home',
  Menu = 'Menu',
  Cart = 'Cart',
  Orders = 'Orders',
  Profile = 'Profile',
  ProductDetail = 'ProductDetail',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  calories?: number;
  tags?: string[];
  tagType?: 'hot' | 'new' | 'sold-out';
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: 'standard' | 'large';
  currentPrice: number; // Price at time of add (base + modifier)
}

export interface UserProfile {
  name: string;
  id: string;
  avatar: string;
  level: string; // e.g., '黄金会员'
  points: number;
}

export interface Coupon {
  id: string;
  title: string;
  amount: number; // e.g., 50 (points or currency)
  type: 'discount' | 'deduction';
  minSpend?: number;
  description: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'placed' | 'completed';
  items: CartItem[];
  totalPrice: number;
  discountAmount?: number;
  finalPrice: number;
}

export interface PointsTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'earn' | 'spend';
  description: string;
}
