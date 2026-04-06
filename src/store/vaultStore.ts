import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VaultSession, MoneyVault } from '@/types/database.types';

interface VaultState {
  vaults: MoneyVault[];
  currentSession: VaultSession | null;
  activeVault: MoneyVault | null;
  setVaults: (vaults: MoneyVault[]) => void;
  setCurrentSession: (session: VaultSession | null) => void;
  setActiveVault: (vault: MoneyVault | null) => void;
}

export const useVaultStore = create<VaultState>()(
  persist(
    (set) => ({
      vaults: [],
      currentSession: null,
      activeVault: null,
      setVaults: (vaults) => set({ vaults }),
      setCurrentSession: (currentSession) => set({ currentSession }),
      setActiveVault: (activeVault) => set({ activeVault }),
    }),
    {
      name: 'cashco-vault',
    }
  )
);
