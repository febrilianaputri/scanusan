import { createContext, useContext, useEffect, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { products, suppliers, transactions, users } from './mockData';
import type { Product, Supplier, Transaction, User } from '../types';

interface AppData {
  products: Product[];
  transactions: Transaction[];
  suppliers: Supplier[];
  users: User[];
}

interface AppDataContextValue {
  data: AppData;
  setData: Dispatch<SetStateAction<AppData>>;
}

const STORAGE_KEY = 'kami-inventory-data';
const initialData: AppData = { products, transactions, suppliers, users };
const AppDataContext = createContext<AppDataContextValue | null>(null);

function loadData(): AppData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialData;
    const parsed: unknown = JSON.parse(saved);
    if (typeof parsed === 'object' && parsed !== null &&
      'products' in parsed && 'transactions' in parsed && 'suppliers' in parsed && 'users' in parsed) {
      return parsed as AppData;
    }
  } catch {
    return initialData;
  }
  return initialData;
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
    }
  }, [data]);

  return <AppDataContext.Provider value={{ data, setData }}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider');
  return context;
}