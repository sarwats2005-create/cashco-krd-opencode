import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  priceType: 'retail' | 'wholesale';
  discount: number;
  lineTotal: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  
  addItem: (item: Omit<CartItem, 'lineTotal'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateDiscount: (itemId: string, discount: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(i => i.itemId === item.itemId);
        
        if (existingItem) {
          const updatedItems = items.map(i =>
            i.itemId === item.itemId
              ? { ...i, quantity: i.quantity + item.quantity, lineTotal: (i.quantity + item.quantity) * i.unitPrice - i.discount }
              : i
          );
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { ...item, lineTotal: item.quantity * item.unitPrice - item.discount }] });
        }
        get().calculateTotals();
      },
      
      removeItem: (itemId) => {
        set({ items: get().items.filter(i => i.itemId !== itemId) });
        get().calculateTotals();
      },
      
      updateQuantity: (itemId, quantity) => {
        const updatedItems = get().items.map(i =>
          i.itemId === itemId
            ? { ...i, quantity, lineTotal: quantity * i.unitPrice - i.discount }
            : i
        );
        set({ items: updatedItems });
        get().calculateTotals();
      },
      
      updateDiscount: (itemId, discount) => {
        const updatedItems = get().items.map(i =>
          i.itemId === itemId
            ? { ...i, discount, lineTotal: i.quantity * i.unitPrice - discount }
            : i
        );
        set({ items: updatedItems });
        get().calculateTotals();
      },
      
      clearCart: () => {
        set({ items: [], subtotal: 0, discount: 0, tax: 0, total: 0 });
      },
      
      calculateTotals: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
        const discount = items.reduce((sum, i) => sum + i.discount, 0);
        const tax = 0;
        const total = subtotal - discount + tax;
        set({ subtotal, discount, tax, total });
      },
    }),
    {
      name: 'cashco-cart',
    }
  )
);
