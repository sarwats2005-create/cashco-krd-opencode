'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, Wallet, Menu, X } from 'lucide-react';
import { useOrgStore } from '@/store/orgStore';
import { useVaultStore } from '@/store/vaultStore';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { currentOrg } = useOrgStore();
  const { currentSession, activeVault } = useVaultStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const vaultStatus = currentSession?.status === 'open';
  const vaultBalance = activeVault?.current_balance || 0;

  const headerStyle: React.CSSProperties = {
    height: '64px',
    backgroundColor: 'white',
    borderBottom: '1px solid #E0E0E0',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    gap: '16px',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  };

  const menuButtonStyle: React.CSSProperties = {
    padding: '8px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#F5F6F7',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoMobileStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const searchContainerStyle: React.CSSProperties = {
    flex: 1,
    maxWidth: '400px',
    display: searchOpen ? 'flex' : 'none',
  };

  const searchWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px 8px 36px',
    backgroundColor: '#F5F6F7',
    borderRadius: '14px',
    border: '1px solid transparent',
    outline: 'none',
    fontSize: '14px',
  };

  const vaultCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#F5F6F7',
    borderRadius: '14px',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
  };

  const exchangeStyle: React.CSSProperties = {
    fontSize: '14px',
    color: 'rgba(47,47,51,0.6)',
  };

  const userAvatarStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#6C63FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 500,
    fontSize: '14px',
  };

  return (
    <header style={headerStyle}>
      <button onClick={onMenuClick} style={menuButtonStyle}>
        <Menu size={20} />
      </button>

      <div style={logoMobileStyle}>
        <div style={{ ...logoMobileStyle, borderRadius: '10px', backgroundColor: '#6C63FF', width: '32px', height: '32px', justifyContent: 'center' }}>
          <span style={{ fontWeight: 'bold', color: 'white', fontSize: '14px' }}>C</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>CashCo-KRD</span>
      </div>

      <div style={searchContainerStyle}>
        <div style={searchWrapperStyle}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(47,47,51,0.5)' }} />
          <input
            type="text"
            placeholder="Search products, transactions..."
            style={searchInputStyle}
          />
        </div>
      </div>

      <button onClick={() => setSearchOpen(!searchOpen)} style={{ ...menuButtonStyle, display: 'flex' }}>
        {searchOpen ? <X size={20} /> : <Search size={20} />}
      </button>

      <div style={{ flex: 1 }} />

      <div style={vaultCardStyle}>
        <Wallet size={16} style={{ color: vaultStatus ? '#27AE60' : '#E74C3C' }} />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          {vaultStatus ? 'Open' : 'Closed'}
        </span>
        <ChevronDown size={16} />
      </div>

      <div style={exchangeStyle}>
        1 USD = <span style={{ fontWeight: 500, color: '#2F2F33' }}>1,310 IQD</span>
      </div>

      <button style={{ ...menuButtonStyle, position: 'relative' }}>
        <Bell size={20} />
        <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#E74C3C', borderRadius: '50%' }} />
      </button>

      <button style={{ ...menuButtonStyle, padding: '4px' }}>
        <div style={userAvatarStyle}>S</div>
      </button>
    </header>
  );
}
