'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, AlertTriangle, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/currency';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  category: string;
  description: string;
  performed_by: string;
  recorded_at: string;
}

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
    default: '#2F2F33',
    credit: '#27AE60',
    debit: '#E74C3C',
    warning: '#F39C12',
  };

  const cardStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: '#F5F6F7',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'box-shadow 0.2s',
  };

  const iconContainerStyle: React.CSSProperties = {
    padding: '12px',
    borderRadius: '14px',
    backgroundColor: '#F5F6F7',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)', marginBottom: '4px' }}>{title}</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: variantColors[variant] }}>
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {change !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
              {change >= 0 ? <ArrowUpRight size={16} color="#27AE60" /> : <ArrowDownRight size={16} color="#E74C3C" />}
              <span style={{ fontSize: '14px', color: change >= 0 ? '#27AE60' : '#E74C3C' }}>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div style={iconContainerStyle}>{icon}</div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const mockTransactions: Transaction[] = [
      { id: '1', type: 'credit', amount: 250000, category: 'Sales Income', description: 'POS Sale #1234', performed_by: 'Ahmed', recorded_at: new Date().toISOString() },
      { id: '2', type: 'debit', amount: 50000, category: 'Expense', description: 'Office supplies', performed_by: 'Sara', recorded_at: new Date().toISOString() },
      { id: '3', type: 'credit', amount: 150000, category: 'Sales Income', description: 'POS Sale #1233', performed_by: 'Ahmed', recorded_at: new Date().toISOString() },
      { id: '4', type: 'debit', amount: 100000, category: 'Employee Advance', description: 'Advance for Omar', performed_by: 'Admin', recorded_at: new Date().toISOString() },
    ];
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 800);
  }, [dateRange]);

  const pageStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const kpiGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  };

  const contentGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '24px',
  };

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    fontSize: '14px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? '#6C63FF' : '#F5F6F7',
    color: isActive ? 'white' : 'rgba(47,47,51,0.6)',
    transition: 'all 0.2s',
  });

  const transactionItemStyle = (type: 'credit' | 'debit'): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    borderRadius: '14px',
    backgroundColor: '#F5F6F7',
    borderLeft: `4px solid ${type === 'credit' ? '#27AE60' : '#E74C3C'}`,
  });

  const quickStatItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Overview</h1>
        <p style={{ color: 'rgba(47,47,51,0.6)' }}>Welcome back! Here's what's happening today.</p>
      </div>

      {loading ? (
        <div style={kpiGridStyle}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ padding: '20px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '60%', height: 14, backgroundColor: '#e0e0e0', borderRadius: 6, marginBottom: 8 }} />
              <div style={{ width: '40%', height: 24, backgroundColor: '#e0e0e0', borderRadius: 6 }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={kpiGridStyle}>
          <KpiCard title="Today's Sales" value={1250000} change={12} icon={<DollarSign size={20} color="#27AE60" />} variant="credit" />
          <KpiCard title="Today's Expenses" value={185000} change={-5} icon={<TrendingDown size={20} color="#E74C3C" />} variant="debit" />
          <KpiCard title="Active Vault Balance" value={4500000} icon={<Wallet size={20} color="#6C63FF" />} />
          <KpiCard title="Low Stock Items" value={8} icon={<AlertTriangle size={20} color="#F39C12" />} variant="warning" />
        </div>
      )}

      <div style={contentGridStyle}>
        <div style={{ padding: '20px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2F2F33' }}>Transaction History</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['today', 'week', 'month'].map((range) => (
                <button key={range} onClick={() => setDateRange(range)} style={buttonStyle(dateRange === range)}>
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map((tx) => (
              <div key={tx.id} style={transactionItemStyle(tx.type)}>
                <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: tx.type === 'credit' ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)' }}>
                  {tx.type === 'credit' ? <ArrowUpRight size={16} color="#27AE60" /> : <ArrowDownRight size={16} color="#E74C3C" />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#2F2F33' }}>{tx.description}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{tx.category} - {tx.performed_by}</p>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: tx.type === 'credit' ? '#27AE60' : '#E74C3C' }}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '20px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2F2F33', marginBottom: '16px' }}>Quick Stats</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={quickStatItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Package size={20} color="#6C63FF" />
                  <span style={{ fontSize: '14px' }}>Total Products</span>
                </div>
                <span style={{ fontWeight: 600 }}>156</span>
              </div>
              <div style={quickStatItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Users size={20} color="#6C63FF" />
                  <span style={{ fontSize: '14px' }}>Active Employees</span>
                </div>
                <span style={{ fontWeight: 600 }}>12</span>
              </div>
              <div style={quickStatItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertTriangle size={20} color="#F39C12" />
                  <span style={{ fontSize: '14px' }}>Pending Advances</span>
                </div>
                <span style={{ fontWeight: 600, color: '#F39C12' }}>3</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2F2F33', marginBottom: '16px' }}>Exchange Rate</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={quickStatItemStyle}>
                <span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>1 USD</span>
                <span style={{ fontWeight: 500 }}>1,310 IQD</span>
              </div>
              <div style={quickStatItemStyle}>
                <span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>1 EUR</span>
                <span style={{ fontWeight: 500 }}>1,420 IQD</span>
              </div>
              <div style={quickStatItemStyle}>
                <span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>1 TRY</span>
                <span style={{ fontWeight: 500 }}>38 IQD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
