'use client';

import { useState } from 'react';
import { Receipt, Plus, Search, Download, MoreVertical, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/currency';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  amount_in_base: number;
  vault_name?: string;
  paid_by: string;
  receipt_url?: string;
  expense_date: string;
}

const mockExpenses: Expense[] = [
  { id: '1', category: 'Rent', description: 'Monthly shop rent', amount: 1500000, currency: 'IQD', amount_in_base: 1500000, vault_name: 'Main Cash Drawer', paid_by: 'Ahmed', expense_date: '2026-04-01' },
  { id: '2', category: 'Utilities', description: 'Electricity bill', amount: 250000, currency: 'IQD', amount_in_base: 250000, vault_name: 'Main Cash Drawer', paid_by: 'Sara', expense_date: '2026-04-02' },
  { id: '3', category: 'Supplies', description: 'Office supplies', amount: 85000, currency: 'IQD', amount_in_base: 85000, vault_name: 'Digital Wallet', paid_by: 'Ahmed', expense_date: '2026-04-03' },
  { id: '4', category: 'Transport', description: 'Delivery transport', amount: 50000, currency: 'IQD', amount_in_base: 50000, vault_name: 'Main Cash Drawer', paid_by: 'Omar', expense_date: '2026-04-04' },
  { id: '5', category: 'Maintenance', description: 'AC repair', amount: 200000, currency: 'IQD', amount_in_base: 200000, vault_name: 'Main Cash Drawer', paid_by: 'Admin', expense_date: '2026-04-05' },
  { id: '6', category: 'Marketing', description: 'Social media ads', amount: 100000, currency: 'IQD', amount_in_base: 100000, vault_name: 'Digital Wallet', paid_by: 'Lana', expense_date: '2026-04-06' },
];

const categories = ['All', 'Rent', 'Utilities', 'Salaries', 'Supplies', 'Maintenance', 'Transport', 'Marketing', 'Equipment', 'Taxes & Fees', 'Other'];

const categoryIcons: Record<string, string> = {
  'Rent': 'R', 'Utilities': 'U', 'Salaries': 'S', 'Supplies': 'P', 'Maintenance': 'M', 'Transport': 'T', 'Marketing': 'M', 'Equipment': 'E', 'Taxes & Fees': 'T', 'Other': 'O',
};

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: '', description: '', amount: 0, vault_id: '', expense_date: new Date().toISOString().split('T')[0] });

  const filteredExpenses = mockExpenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount_in_base, 0);

  const cardStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#F5F6F7',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
  };

  const buttonStyle = (primary = false): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: primary ? '#6C63FF' : '#F5F6F7',
    color: primary ? 'white' : '#2F2F33',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#F5F6F7',
    borderRadius: '16px',
    border: '1px solid transparent',
    outline: 'none',
    fontSize: '14px',
  };

  const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    fontSize: '14px',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? '#6C63FF' : '#F5F6F7',
    color: isActive ? 'white' : 'rgba(47,47,51,0.6)',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Expenses</h1>
          <p style={{ color: 'rgba(47,47,51,0.6)' }}>Track and manage business expenses</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={buttonStyle()}>
            <Download size={16} />
            Export
          </button>
          <button style={buttonStyle(true)} onClick={() => setAddExpenseModal(true)}>
            <Plus size={16} />
            Add Expense
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Receipt size={32} color="#6C63FF" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{mockExpenses.length}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Expenses</p>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DollarSign size={32} color="#E74C3C" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#E74C3C' }}>{formatCurrency(totalExpenses)}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Amount</p>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(47,47,51,0.4)' }} />
            <input type="text" placeholder="Search expenses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={filterButtonStyle(selectedCategory === cat)}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: '24px', padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F5F6F7' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Description</th>
                <th style={{ textAlign: 'right', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Vault</th>
                <th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Paid By</th>
                <th style={{ textAlign: 'center', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} style={{ borderTop: '1px solid #E0E0E0' }}>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="rgba(47,47,51,0.4)" />
                      {formatDate(expense.expense_date)}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#6C63FF' }}>{categoryIcons[expense.category] || 'O'}</span>
                      <span style={{ fontSize: '14px' }}>{expense.category}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{expense.description}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#E74C3C' }}>{formatCurrency(expense.amount, expense.currency)}</p>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{expense.vault_name || '-'}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{expense.paid_by}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button style={{ padding: '8px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Showing {filteredExpenses.length} of {mockExpenses.length} expenses</p>
          <p style={{ fontSize: '14px', fontWeight: 'bold' }}>Total: <span style={{ color: '#E74C3C' }}>{formatCurrency(totalExpenses)}</span></p>
        </div>
      </div>

      {addExpenseModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Add New Expense</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Date</label>
                <input type="date" style={inputStyle} value={newExpense.expense_date} onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Category</label>
                <select style={inputStyle} value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Description</label>
                <input style={inputStyle} placeholder="Enter description" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Amount (IQD)</label>
                <input type="number" style={inputStyle} value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ ...buttonStyle(), flex: 1 }} onClick={() => setAddExpenseModal(false)}>Cancel</button>
                <button style={{ ...buttonStyle(true), flex: 1 }} onClick={() => setAddExpenseModal(false)}>Add Expense</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
