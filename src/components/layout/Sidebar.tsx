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
  LogOut,
  Menu
} from 'lucide-react';
import { cn } from '@/utils/currency';
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

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#2F2F33] text-white flex flex-col z-40 shadow-[4px_0_24px_rgba(47,47,51,0.12)]">
      {/* Logo & Org */}
      <div className="p-4 border-b border-white/10">
        <Link href="/overview" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#6C63FF] flex items-center justify-center font-bold text-lg">
            C
          </div>
          <div>
            <h1 className="font-semibold text-sm">CashCo-KRD</h1>
            <p className="text-xs text-white/60 truncate max-w-[150px]">
              {currentOrg?.name || 'Select Organization'}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all duration-200',
                    isActive 
                      ? 'bg-[#6C63FF] shadow-lg' 
                      : 'hover:bg-white/10'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-[14px] hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="text-sm">Notifications</span>
          <span className="ml-auto bg-[#E74C3C] text-white text-xs px-2 py-0.5 rounded-full">3</span>
        </button>
        
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-[14px] hover:bg-white/10 transition-colors">
          <Globe className="w-5 h-5" />
          <span className="text-sm">English</span>
        </button>
        
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-[14px] hover:bg-white/10 transition-colors text-[#E74C3C]">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
