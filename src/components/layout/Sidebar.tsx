'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Wallet, Users, Receipt, Settings, Bell, Globe, LogOut } from 'lucide-react';
import { useOrgStore } from '@/store/orgStore';
import { showToast } from '@/store/toastStore';

const navItems = [
  { href: '/overview', icon: LayoutDashboard, label: 'Overview' },
  { href: '/pos', icon: ShoppingCart, label: 'POS Terminal' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/vault', icon: Wallet, label: 'Money Vault' },
  { href: '/employees', icon: Users, label: 'Employees' },
  { href: '/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ onMobileClose }: { onMobileClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentOrg } = useOrgStore();

  const handleLogout = () => {
    showToast('Logged out successfully!', 'success');
    router.push('/sign-in');
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed', left: 0, top: 0, height: '100vh', width: '240px',
    backgroundColor: '#2F2F33', color: 'white', display: 'flex', flexDirection: 'column', zIndex: 40,
  };

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
    borderRadius: '14px', transition: 'all 0.2s', cursor: 'pointer',
    backgroundColor: isActive ? '#6C63FF' : 'transparent',
    boxShadow: isActive ? '0 4px 12px rgba(108,99,255,0.4)' : 'none',
    border: 'none', color: 'white', width: '100%', textAlign: 'left', fontSize: '14px',
  });

  const bottomBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
    borderRadius: '14px', transition: 'all 0.2s', cursor: 'pointer',
    backgroundColor: 'transparent', border: 'none', color: 'white', width: '100%', textAlign: 'left', fontSize: '14px',
  };

  return (
    <aside style={sidebarStyle}>
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/overview" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>C</div>
          <div><h1 style={{ fontWeight: 600, fontSize: '14px' }}>CashCo-KRD</h1><p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentOrg?.name || 'Demo Organization'}</p></div>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={onMobileClose} style={{ display: 'block', marginBottom: '4px', textDecoration: 'none' }}>
              <div style={navItemStyle(isActive)}>
                <Icon size={20} />
                <span style={{ fontWeight: 500 }}>{item.label}</span>
                {isActive && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button style={bottomBtnStyle}>
          <Bell size={20} /><span style={{ flex: 1 }}>Notifications</span>
          <span style={{ backgroundColor: '#E74C3C', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>3</span>
        </button>
        <button style={bottomBtnStyle}>
          <Globe size={20} /><span>English</span>
        </button>
        <button onClick={handleLogout} style={{ ...bottomBtnStyle, color: '#E74C3C' }}>
          <LogOut size={20} /><span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
