import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Organization } from '@/types/database.types';

interface OrgState {
  organizations: Organization[];
  currentOrg: Organization | null;
  setOrganizations: (orgs: Organization[]) => void;
  setCurrentOrg: (org: Organization | null) => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      organizations: [],
      currentOrg: null,
      setOrganizations: (organizations) => set({ organizations }),
      setCurrentOrg: (currentOrg) => set({ currentOrg }),
    }),
    {
      name: 'cashco-org',
    }
  )
);
