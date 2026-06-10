// src/core/types/index.ts
export interface UserEntity {
  id: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface GroupOrderEntity {
  id: string;
  hostId: string;
  hostEmail: string;
  participants: UserEntity[]; // Capped strictly at 3
  items: { [userId: string]: OrderItem[] }; 
  status: 'active' | 'checked_out';
}

// Global Minimal Menu Definition
export const MENU_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Premium Wagyu Smash Burger', price: 16.50 },
  { id: 'p2', name: 'Truffle Parmesan Fries', price: 6.25 },
  { id: 'p3', name: 'Craft Avocado Green Shake', price: 7.00 },
];
