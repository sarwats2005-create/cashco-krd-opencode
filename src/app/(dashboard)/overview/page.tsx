'use client';

import { useInventoryStore } from '@/store/inventoryStore';
import { useVaultStore } from '@/store/vaultStore';
import { useEmployeeStore } from '@/store/employeeStore';
import { useExpenseStore } from '@/store/expenseStore';
import { DollarSign, Package, Users, AlertTriangle, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/currency';

export default function OverviewPage() {
  const { items: products } = useInventoryStore();
  const { transactions, getTotalBalance, vaults } = useVaultStore();
  const { employees } = useEmployeeStore();
  const { expenses, getTotal } = useExpenseStore();

  const lowStockCount = products.filter(p => p.current_stock < p.reorder_level && p.current_stock > 0).length;
  const todaySales = transactions.filter(t => t.category === 'Sales' && t.date.startsWith(new Date().toISOString().split('T')[0])).reduce((s, t) => s + t.amount, 0);
  const todayExpenses = expenses.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((s, e) => s + e.amount, 0);
  const totalBalance = getTotalBalance();
  const activeEmployees = employees.filter(e => e.status === 'active').length;

  const cardStyle: React.CSSProperties = { padding: '20px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' };
  const kpiGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginBottom: '24px' };
  const contentGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px' };
  const txItemStyle = (type: 'credit' | 'debit'): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '14px', backgroundColor: '#F5F6F7', borderLeft: `4px solid ${type === 'credit' ? '#27AE60' : '#E74C3C'}` });
  const statItemStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}><h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Overview</h1><p style={{ color: 'rgba(47,47,51,0.6)' }}>Welcome back! Here's what's happening today.</p></div>

      <div style={kpiGridStyle}>
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)', marginBottom: '4px' }}>Today's Sales</p><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#27AE60' }}>{formatCurrency(todaySales)}</p><div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: '#27AE60' }}><ArrowUpRight size={16} /><span style={{ fontSize: '14px' }}>12%</span></div></div>
          <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(39,174,96,0.1)' }}><DollarSign size={20} color="#27AE60" /></div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)', marginBottom: '4px' }}>Today's Expenses</p><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#E74C3C' }}>{formatCurrency(todayExpenses)}</p><div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: '#E74C3C' }}><ArrowDownRight size={16} /><span style={{ fontSize: '14px' }}>5%</span></div></div>
          <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(231,76,60,0.1)' }}><Wallet size={20} color="#E74C3C" /></div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)', marginBottom: '4px' }}>Vault Balance</p><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6C63FF' }}>{formatCurrency(totalBalance)}</p><div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: 'rgba(47,47,51,0.6)' }}><span style={{ fontSize: '14px' }}>{vaults.filter(v => v.status === 'open').length} vaults open</span></div></div>
          <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(108,99,255,0.1)' }}><Wallet size={20} color="#6C63FF" /></div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)', marginBottom: '4px' }}>Low Stock Items</p><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F39C12' }}>{lowStockCount}</p><div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: 'rgba(47,47,51,0.6)' }}><span style={{ fontSize: '14px' }}>Need reorder</span></div></div>
          <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(243,156,18,0.1)' }}><AlertTriangle size={20} color="#F39C12" /></div>
        </div>
      </div>

      <div style={contentGridStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}><h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2F2F33' }}>Recent Transactions</h2><span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Latest activity</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.slice(0, 6).map(tx => (
              <div key={tx.id} style={txItemStyle(tx.type)}>
                <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: tx.type === 'credit' ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)' }}>{tx.type === 'credit' ? <ArrowUpRight size={16} color="#27AE60" /> : <ArrowDownRight size={16} color="#E74C3C" />}</div>
                <div style={{ flex: 1 }}><p style={{ fontSize: '14px', fontWeight: 500, color: '#2F2F33' }}>{tx.description}</p><p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{tx.category} - {tx.performedBy}</p></div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: tx.type === 'credit' ? '#27AE60' : '#E74C3C' }}>{tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2F2F33', marginBottom: '16px' }}>Quick Stats</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={statItemStyle}><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Package size={20} color="#6C63FF" /><span style={{ fontSize: '14px' }}>Total Products</span></div><span style={{ fontWeight: 600 }}>{products.length}</span></div>
              <div style={statItemStyle}><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={20} color="#6C63FF" /><span style={{ fontSize: '14px' }}>Active Employees</span></div><span style={{ fontWeight: 600 }}>{activeEmployees}</span></div>
              <div style={statItemStyle}><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><AlertTriangle size={20} color="#F39C12" /><span style={{ fontSize: '14px' }}>Pending Advances</span></div><span style={{ fontWeight: 600, color: '#F39C12' }}>0</span></div>
            </div>
          </div>
          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2F2F33', marginBottom: '16px' }}>Exchange Rate</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={statItemStyle}><span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>1 USD</span><span style={{ fontWeight: 500 }}>1,310 IQD</span></div>
              <div style={statItemStyle}><span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>1 EUR</span><span style={{ fontWeight: 500 }}>1,420 IQD</span></div>
              <div style={statItemStyle}><span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>1 TRY</span><span style={{ fontWeight: 500 }}>38 IQD</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
