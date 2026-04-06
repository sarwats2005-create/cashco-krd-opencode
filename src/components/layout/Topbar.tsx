'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, Wallet, Menu, X } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { useOrgStore } from '@/store/orgStore';
import { useVaultStore } from '@/store/vaultStore';
import { formatCurrency } from '@/utils/currency';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { currentOrg } = useOrgStore();
  const { currentSession, activeVault } = useVaultStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const vaultStatus = currentSession?.status === 'open';
  const vaultBalance = activeVault?.current_balance || 0;

  return (
    <header className="h-[64px] bg-white border-b border-[#E0E0E0] flex items-center px-4 gap-4">
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-[14px] hover:bg-[#F5F6F7]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo (mobile) */}
      <div className="lg:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-[10px] bg-[#6C63FF] flex items-center justify-center font-bold text-white text-sm">
          C
        </div>
        <span className="font-semibold text-sm">CashCo-KRD</span>
      </div>

      {/* Search Bar */}
      <div className={`flex-1 max-w-md ${searchOpen ? 'flex' : 'hidden md:flex'}`}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2F2F33]/50" />
          <input
            type="text"
            placeholder="Search products, transactions, employees..."
            className="w-full pl-10 pr-4 py-2 bg-[#F5F6F7] rounded-[14px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
          />
        </div>
      </div>

      {/* Mobile Search Toggle */}
      <button 
        onClick={() => setSearchOpen(!searchOpen)}
        className="md:hidden p-2 rounded-[14px] hover:bg-[#F5F6F7]"
      >
        {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Vault Status */}
      <ClayCard className="hidden sm:flex items-center gap-2 px-4 py-2">
        <Wallet className={`w-4 h-4 ${vaultStatus ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`} />
        <span className="text-sm font-medium">
          {vaultStatus ? 'Open' : 'Closed'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </ClayCard>

      {/* Exchange Rate */}
      <div className="hidden md:block text-sm text-[#2F2F33]/60">
        1 USD = <span className="font-medium text-[#2F2F33]">1,310 IQD</span>
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-[14px] hover:bg-[#F5F6F7]">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#E74C3C] rounded-full" />
      </button>

      {/* User Avatar */}
      <button className="flex items-center gap-2 p-1 rounded-[14px] hover:bg-[#F5F6F7]">
        <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center text-white font-medium text-sm">
          S
        </div>
        <ChevronDown className="w-4 h-4 hidden sm:block" />
      </button>
    </header>
  );
}
