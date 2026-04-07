import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Vault {
  id: string;
  name: string;
  currency: string;
  openingBalance: number;
  currentBalance: number;
  status: 'open' | 'closed';
}

export interface VaultTransaction {
  id: string;
  vaultId: string;
  type: 'credit' | 'debit';
  amount: number;
  category: string;
  description: string;
  performedBy: string;
  date: string;
}

interface VaultState {
  vaults: Vault[];
  transactions: VaultTransaction[];
  addVault: (vault: Omit<Vault, 'id'>) => void;
  openVault: (id: string, openingBalance: number) => void;
  closeVault: (id: string) => void;
  addTransaction: (tx: Omit<VaultTransaction, 'id'>) => void;
  getActiveVaults: () => Vault[];
  getTotalBalance: () => number;
}

const defaultVaults: Vault[] = [
  { id: '1', name: 'Main Cash Drawer', currency: 'IQD', openingBalance: 1000000, currentBalance: 4500000, status: 'open' },
  { id: '2', name: 'USD Vault', currency: 'USD', openingBalance: 1000, currentBalance: 1500, status: 'closed' },
  { id: '3', name: 'Digital Wallet', currency: 'IQD', openingBalance: 500000, currentBalance: 2500000, status: 'open' },
];

const defaultTransactions: VaultTransaction[] = [
  { id: '1', vaultId: '1', type: 'credit', amount: 250000, category: 'Sales', description: 'POS Sale #1234', performedBy: 'Ahmed', date: new Date().toISOString() },
  { id: '2', vaultId: '1', type: 'debit', amount: 50000, category: 'Expense', description: 'Office supplies', performedBy: 'Sara', date: new Date().toISOString() },
  { id: '3', vaultId: '1', type: 'credit', amount: 150000, category: 'Sales', description: 'POS Sale #1233', performedBy: 'Ahmed', date: new Date().toISOString() },
  { id: '4', vaultId: '1', type: 'debit', amount: 100000, category: 'Advance', description: 'Advance for Omar', performedBy: 'Admin', date: new Date().toISOString() },
];

export const useVaultStore = create<VaultState>()(
  persist(
    (set, get) => ({
      vaults: defaultVaults,
      transactions: defaultTransactions,
      addVault: (vault) => set((state) => ({
        vaults: [...state.vaults, { ...vault, id: Date.now().toString() }],
      })),
      openVault: (id, openingBalance) => set((state) => ({
        vaults: state.vaults.map((v) => v.id === id ? { ...v, status: 'open' as const, openingBalance, currentBalance: openingBalance } : v),
      })),
      closeVault: (id) => set((state) => ({
        vaults: state.vaults.map((v) => v.id === id ? { ...v, status: 'closed' as const } : v),
      })),
      addTransaction: (tx) => set((state) => {
        const newTx = { ...tx, id: Date.now().toString() };
        const updatedVaults = state.vaults.map((v) => {
          if (v.id === tx.vaultId && v.status === 'open') {
            return { ...v, currentBalance: tx.type === 'credit' ? v.currentBalance + tx.amount : v.currentBalance - tx.amount };
          }
          return v;
        });
        return { transactions: [newTx, ...state.transactions], vaults: updatedVaults };
      }),
      getActiveVaults: () => get().vaults.filter((v) => v.status === 'open'),
      getTotalBalance: () => get().vaults.filter((v) => v.status === 'open').reduce((sum, v) => sum + v.currentBalance, 0),
    }),
    { name: 'cashco-vault' }
  )
);
