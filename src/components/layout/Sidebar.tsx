'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Wallet, 
  Users, 
  Receipt, 
  Settings, 
  Bell,
  Globe,
  LogOut
} from 'lucide-react';
import { useOrgStore } from '@/store/orgStore';

const navItems = [
  { href: '/overview', icon: LayoutDashboard, label: 'Overview', module: 'dashboard' },
  { href: '/pos', icon: ShoppingCart, label: 'POS Terminal', module: 'pos' },
  { href: '/inventory', icon: Package, label: 'Inventory', module: 'inventory' },
  { href: '/vault', icon: Wallet, label: 'Money Vault', module: 'vault' },
  { href: '/employees', icon: Users, label: 'Employees', module: 'employees' },
  { href: '/expenses', icon: Receipt, label: 'Expenses', module: 'expenses' },
  { href: '/settings', icon: Settings, label: 'Settings', module: 'settings' },
];

interface SidebarProps {
  onMobileClose?: () => void;
}

export function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentOrg } = useOrgStore();

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: '240px',
    backgroundColor: '#2F2F33',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 40,
    boxShadow: '4px 0 24px rgba(47,47,51,0.12)',
  };

  const logoContainerStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  };

  const navStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px',
    overflowY: 'auto',
  };

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '14px',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? '#6C63FF' : 'transparent',
    boxShadow: isActive ? '0 4px 12px rgba(108,99,255,0.4)' : 'none',
  });

  const bottomStyle: React.CSSProperties = {
    padding: '12px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <aside style={sidebarStyle}>
      <div style={logoContainerStyle}>
        <Link href="/overview" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '14px',
            backgroundColor: '#6C63FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
          }}>
            C
          </div>
          <div>
            <h1 style={{ fontWeight: 600, fontSize: '14px' }}>CashCo-KRD</h1>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentOrg?.name || 'Select Organization'}
            </p>
          </div>
        </Link>
      </div>

      <nav style={navStyle}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href} style={{ marginBottom: '4px' }}>
                <Link
                  href={item.href}
                  onClick={onMobileClose}
                  style={navItemStyle(isActive)}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      style={{
                        marginLeft: 'auto',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={bottomStyle}>
        <button style={{ ...navItemStyle(false), width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
          <Bell size={20} />
          <span style={{ fontSize: '14px' }}>Notifications</span>
          <span style={{ marginLeft: 'auto', backgroundColor: '#E74C3C', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>3</span>
        </button>
        
        <button style={{ ...navItemStyle(false), width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
          <Globe size={20} />
          <span style={{ fontSize: '14px' }}>English</span>
        </button>
        
        <button style={{ ...navItemStyle(false), width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: '#E74C3C' }}>
          <LogOut size={20} />
          <span style={{ fontSize: '14px' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
