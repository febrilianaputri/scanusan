export type Theme = 'light' | 'dark';

export type Page =
  | 'dashboard'
  | 'inventory'
  | 'transactions'
  | 'stock-transaction'
  | 'iot-scanner'
  | 'scan-activity'
  | 'reports'
  | 'suppliers'
  | 'users'
  | 'settings'
  | 'profile'
  | 'account-settings';

export type AuthPage = 'login' | 'register' | 'forgot-password';

export type UserRole = 'admin' | 'operator';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  position?: string;
  department?: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  currentStock: number;
  unit: string;
  minStock: number;
  status: 'good' | 'low' | 'out';
  location: string;
  supplier: string;
}

export interface Transaction {
  id: string;
  time: string;
  barcode: string;
  product: string;
  type: 'in' | 'out';
  quantity: number;
  prevStock: number;
  currentStock: number;
  scanner: string;
  user: string;
}

export interface Scanner {
  id: string;
  name: string;
  status: 'online' | 'offline';
  wifi: string;
  battery: number;
  lastScan: string;
  totalScans: number;
  ipAddress: string;
  firmware: string;
  uptime: string;
  lastSeen?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  products: number;
  lastTransaction: string;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  status: 'active' | 'inactive';
  lastActivity: string;
}
