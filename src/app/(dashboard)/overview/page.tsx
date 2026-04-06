'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, AlertTriangle, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayBadge } from '@/components/ui/clay/ClayBadge';
import { formatCurrency, formatDate } from '@/utils/currency';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  variant?: 'default' | 'credit' | 'debit' | 'warning';
  onClick?: () => void;
}

function KpiCard({ title, value, change, icon, variant = 'default', onClick }: KpiCardProps) {
  const variantColors = {
    default: 'text-[#2F2F33]',
    credit: 'text-[#27AE60]',
    debit: 'text-[#E74C3C]',
    warning: 'text-[#F39C12]',
  };

  return (
    <ClayCard 
      className="p-5 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#2F2F33]/60 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${variantColors[variant]}`}>
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
              {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-[14px] bg-[#F5F6F7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
          {icon}
        </div>
      </div>
    </ClayCard>
  );
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  category: string;
  description: string;
  performed_by: string;
  recorded_at: string;
}

export default function OverviewPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    const mockTransactions: Transaction[] = [
      { id: '1', type: 'credit', amount: 250000, category: 'Sales Income', description: 'POS Sale #1234', performed_by: 'Ahmed', recorded_at: new Date().toISOString() },
      { id: '2', type: 'debit', amount: 50000, category: 'Expense', description: 'Office supplies', performed_by: 'Sara', recorded_at: new Date().toISOString() },
      { id: '3', type: 'credit', amount: 150000, category: 'Sales Income', description: 'POS Sale #1233', performed_by: 'Ahmed', recorded_at: new Date().toISOString() },
      { id: '4', type: 'debit', amount: 100000, category: 'Employee Advance', description: 'Advance for Omar', performed_by: 'Admin', recorded_at: new Date().toISOString() },
    ];
    setTransactions(mockTransactions);
  }, [dateRange]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2F2F33]">Overview</h1>
        <p className="text-[#2F2F33]/60">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Today's Sales"
          value={1250000}
          change={12}
          icon={<DollarSign className="w-5 h-5 text-[#27AE60]" />}
          variant="credit"
        />
        <KpiCard
          title="Today's Expenses"
          value={185000}
          change={-5}
          icon={<TrendingDown className="w-5 h-5 text-[#E74C3C]" />}
          variant="debit"
        />
        <KpiCard
          title="Active Vault Balance"
          value={4500000}
          icon={<Wallet className="w-5 h-5 text-[#6C63FF]" />}
        />
        <KpiCard
          title="Low Stock Items"
          value={8}
          icon={<AlertTriangle className="w-5 h-5 text-[#F39C12]" />}
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction History */}
        <ClayCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2F2F33]">Transaction History</h2>
            <div className="flex gap-2">
              {['today', 'week', 'month'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 text-sm rounded-[10px] transition-colors ${
                    dateRange === range 
                      ? 'bg-[#6C63FF] text-white' 
                      : 'bg-[#F5F6F7] text-[#2F2F33]/60 hover:bg-[#E0E0E0]'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-3 rounded-[14px] bg-[#F5F6F7] border-l-4 ${
                  tx.type === 'credit' ? 'border-l-[#27AE60]' : 'border-l-[#E74C3C]'
                }`}
              >
                <div className={`p-2 rounded-[10px] ${tx.type === 'credit' ? 'bg-[#27AE60]/10' : 'bg-[#E74C3C]/10'}`}>
                  {tx.type === 'credit' 
                    ? <ArrowUpRight className="w-4 h-4 text-[#27AE60]" /> 
                    : <ArrowDownRight className="w-4 h-4 text-[#E74C3C]" />
                  }
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-[#2F2F33]">{tx.description}</p>
                  <p className="text-xs text-[#2F2F33]/60">{tx.category} • {tx.performed_by}</p>
                </div>
                <p className={`font-bold ${tx.type === 'credit' ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </motion.div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8 text-[#2F2F33]/60">
                No transactions found
              </div>
            )}
          </div>
        </ClayCard>

        {/* Quick Stats */}
        <div className="space-y-4">
          <ClayCard className="p-5">
            <h2 className="text-lg font-semibold text-[#2F2F33] mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#6C63FF]" />
                  <span className="text-sm">Total Products</span>
                </div>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#6C63FF]" />
                  <span className="text-sm">Active Employees</span>
                </div>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#F39C12]" />
                  <span className="text-sm">Pending Advances</span>
                </div>
                <span className="font-semibold text-[#F39C12]">3</span>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="p-5">
            <h2 className="text-lg font-semibold text-[#2F2F33] mb-4">Exchange Rate</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#2F2F33]/60">1 USD</span>
                <span className="font-medium">1,310 IQD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#2F2F33]/60">1 EUR</span>
                <span className="font-medium">1,420 IQD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#2F2F33]/60">1 TRY</span>
                <span className="font-medium">38 IQD</span>
              </div>
            </div>
          </ClayCard>
        </div>
      </div>
    </div>
  );
}
