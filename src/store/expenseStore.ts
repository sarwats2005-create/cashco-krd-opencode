import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  vaultName: string;
  paidBy: string;
  date: string;
}

interface ExpenseState {
  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getTotal: () => number;
  getByCategory: () => Record<string, number>;
}

const defaultExpenses: Expense[] = [
  { id: '1', category: 'Rent', description: 'Monthly shop rent', amount: 1500000, currency: 'IQD', vaultName: 'Main Cash Drawer', paidBy: 'Ahmed', date: '2026-04-01' },
  { id: '2', category: 'Utilities', description: 'Electricity bill', amount: 250000, currency: 'IQD', vaultName: 'Main Cash Drawer', paidBy: 'Sara', date: '2026-04-02' },
  { id: '3', category: 'Supplies', description: 'Office supplies', amount: 85000, currency: 'IQD', vaultName: 'Digital Wallet', paidBy: 'Ahmed', date: '2026-04-03' },
  { id: '4', category: 'Transport', description: 'Delivery transport', amount: 50000, currency: 'IQD', vaultName: 'Main Cash Drawer', paidBy: 'Omar', date: '2026-04-04' },
  { id: '5', category: 'Maintenance', description: 'AC repair', amount: 200000, currency: 'IQD', vaultName: 'Main Cash Drawer', paidBy: 'Admin', date: '2026-04-05' },
  { id: '6', category: 'Marketing', description: 'Social media ads', amount: 100000, currency: 'IQD', vaultName: 'Digital Wallet', paidBy: 'Lana', date: '2026-04-06' },
];

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: defaultExpenses,
      addExpense: (exp) => set((state) => ({
        expenses: [{ ...exp, id: Date.now().toString() }, ...state.expenses],
      })),
      updateExpense: (id, updates) => set((state) => ({
        expenses: state.expenses.map((e) => e.id === id ? { ...e, ...updates } : e),
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      })),
      getTotal: () => get().expenses.reduce((sum, e) => sum + e.amount, 0),
      getByCategory: () => {
        const cats: Record<string, number> = {};
        get().expenses.forEach((e) => {
          cats[e.category] = (cats[e.category] || 0) + e.amount;
        });
        return cats;
      },
    }),
    { name: 'cashco-expenses' }
  )
);
