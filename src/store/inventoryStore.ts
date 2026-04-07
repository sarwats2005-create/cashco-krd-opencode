import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit_type: string;
  sku: string;
  barcode: string;
  retail_price: number;
  wholesale_price: number;
  wholesale_min_qty: number;
  current_stock: number;
  reorder_level: number;
  is_active: boolean;
}

interface InventoryState {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  addStock: (id: string, qty: number) => void;
  removeStock: (id: string, qty: number) => void;
}

const defaultItems: InventoryItem[] = [
  { id: '1', name: 'Coca Cola', category: 'Beverages', unit_type: 'piece', sku: 'CC-001', barcode: '123456789', retail_price: 500, wholesale_price: 450, wholesale_min_qty: 10, current_stock: 50, reorder_level: 10, is_active: true },
  { id: '2', name: 'Water Bottle', category: 'Beverages', unit_type: 'piece', sku: 'WB-002', barcode: '123456790', retail_price: 250, wholesale_price: 200, wholesale_min_qty: 20, current_stock: 200, reorder_level: 50, is_active: true },
  { id: '3', name: 'Arabic Coffee', category: 'Beverages', unit_type: 'piece', sku: 'AC-003', barcode: '123456791', retail_price: 1500, wholesale_price: 1300, wholesale_min_qty: 5, current_stock: 30, reorder_level: 5, is_active: true },
  { id: '4', name: 'Labneh', category: 'Dairy', unit_type: 'piece', sku: 'LB-004', barcode: '123456792', retail_price: 2000, wholesale_price: 1800, wholesale_min_qty: 6, current_stock: 15, reorder_level: 5, is_active: true },
  { id: '5', name: 'Bread', category: 'Bakery', unit_type: 'piece', sku: 'BR-005', barcode: '123456793', retail_price: 500, wholesale_price: 400, wholesale_min_qty: 20, current_stock: 100, reorder_level: 20, is_active: true },
  { id: '6', name: 'Dates', category: 'Dry Goods', unit_type: 'piece', sku: 'DT-006', barcode: '123456794', retail_price: 5000, wholesale_price: 4500, wholesale_min_qty: 5, current_stock: 25, reorder_level: 5, is_active: true },
  { id: '7', name: 'Vegetable Oil', category: 'Oils', unit_type: 'piece', sku: 'VO-007', barcode: '123456795', retail_price: 3500, wholesale_price: 3200, wholesale_min_qty: 6, current_stock: 40, reorder_level: 10, is_active: true },
  { id: '8', name: 'Rice', category: 'Dry Goods', unit_type: 'piece', sku: 'RC-008', barcode: '123456796', retail_price: 2500, wholesale_price: 2200, wholesale_min_qty: 10, current_stock: 80, reorder_level: 15, is_active: true },
];

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      items: defaultItems,
      addItem: (item) => set((state) => ({
        items: [...state.items, { ...item, id: Date.now().toString() }],
      })),
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      })),
      deleteItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      addStock: (id, qty) => set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, current_stock: i.current_stock + qty } : i)),
      })),
      removeStock: (id, qty) => set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, current_stock: Math.max(0, i.current_stock - qty) } : i)),
      })),
    }),
    { name: 'cashco-inventory' }
  )
);
