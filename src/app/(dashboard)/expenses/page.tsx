'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Plus, Search, Download, Filter, MoreVertical, DollarSign, Calendar } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';
import { ClayBadge } from '@/components/ui/clay/ClayBadge';
import { ClayModal } from '@/components/ui/clay/ClayModal';
import { ClayInput } from '@/components/ui/clay/ClayInput';
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
  'Rent': '🏠',
  'Utilities': '💡',
  'Salaries': '💰',
  'Supplies': '📦',
  'Maintenance': '🔧',
  'Transport': '🚚',
  'Marketing': '📢',
  'Equipment': '🖥️',
  'Taxes & Fees': '📋',
  'Other': '📝',
};

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('all');
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    description: '',
    amount: 0,
    vault_id: '',
    expense_date: new Date().toISOString().split('T')[0],
  });

  const filteredExpenses = mockExpenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount_in_base, 0);
  const categoryTotals = categories.filter(c => c !== 'All').map(cat => ({
    category: cat,
    total: mockExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount_in_base, 0),
  })).sort((a, b) => b.total - a.total);

  const handleAddExpense = () => {
    setAddExpenseModal(false);
    setNewExpense({
      category: '',
      description: '',
      amount: 0,
      vault_id: '',
      expense_date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F2F33]">Expenses</h1>
          <p className="text-[#2F2F33]/60">Track and manage business expenses</p>
        </div>
        <div className="flex gap-2">
          <ClayButton variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </ClayButton>
          <ClayButton variant="primary" onClick={() => setAddExpenseModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </ClayButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ClayCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[16px] bg-[#E74C3C]/10">
              <Receipt className="w-6 h-6 text-[#E74C3C]" />
            </div>
            <div>
              <p className="text-sm text-[#2F2F33]/60">Total Expenses</p>
              <p className="text-2xl font-bold text-[#E74C3C]">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[16px] bg-[#6C63FF]/10">
              <Receipt className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <div>
              <p className="text-sm text-[#2F2F33]/60">This Month</p>
              <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[16px] bg-[#F39C12]/10">
              <DollarSign className="w-6 h-6 text-[#F39C12]" />
            </div>
            <div>
              <p className="text-sm text-[#2F2F33]/60">Transactions</p>
              <p className="text-2xl font-bold">{filteredExpenses.length}</p>
            </div>
          </div>
        </ClayCard>
      </div>

      {/* Category Breakdown */}
      <ClayCard className="p-5">
        <h2 className="text-lg font-semibold text-[#2F2F33] mb-4">Category Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categoryTotals.slice(0, 5).map((cat) => (
            <div key={cat.category} className="p-3 rounded-[14px] bg-[#F5F6F7] text-center">
              <p className="text-2xl mb-1">{categoryIcons[cat.category] || '📝'}</p>
              <p className="text-sm font-medium">{cat.category}</p>
              <p className="text-sm text-[#E74C3C] font-bold">{formatCurrency(cat.total)}</p>
            </div>
          ))}
        </div>
      </ClayCard>

      {/* Filters */}
      <ClayCard className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2F2F33]/40" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6F7] rounded-[14px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-sm rounded-[999px] whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#6C63FF] text-white'
                    : 'bg-[#F5F6F7] text-[#2F2F33]/60 hover:bg-[#E0E0E0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </ClayCard>

      {/* Expenses Table */}
      <ClayCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F6F7]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#2F2F33]/60">Date</th>
                <th className="text-left p-4 text-sm font-medium text-[#2F2F33]/60">Category</th>
                <th className="text-left p-4 text-sm font-medium text-[#2F2F33]/60">Description</th>
                <th className="text-right p-4 text-sm font-medium text-[#2F2F33]/60">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-[#2F2F33]/60">Vault</th>
                <th className="text-left p-4 text-sm font-medium text-[#2F2F33]/60">Paid By</th>
                <th className="text-center p-4 text-sm font-medium text-[#2F2F33]/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <motion.tr
                  key={expense.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t border-[#E0E0E0] hover:bg-[#F5F6F7]/50"
                >
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2F2F33]/40" />
                      {formatDate(expense.expense_date)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span>{categoryIcons[expense.category] || '📝'}</span>
                      <span className="text-sm">{expense.category}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{expense.description}</td>
                  <td className="p-4 text-right">
                    <p className="font-bold text-[#E74C3C]">{formatCurrency(expense.amount, expense.currency)}</p>
                  </td>
                  <td className="p-4 text-sm">{expense.vault_name || '-'}</td>
                  <td className="p-4 text-sm">{expense.paid_by}</td>
                  <td className="p-4 text-center">
                    <button className="p-2 rounded-[10px] hover:bg-[#F5F6F7]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[#2F2F33]/60">
            <Receipt className="w-12 h-12 mb-4" />
            <p>No expenses found</p>
          </div>
        )}

        <div className="p-4 border-t border-[#E0E0E0]">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[#2F2F33]/60">
              Showing {filteredExpenses.length} of {mockExpenses.length} expenses
            </p>
            <p className="text-sm font-bold">
              Total: <span className="text-[#E74C3C]">{formatCurrency(totalExpenses)}</span>
            </p>
          </div>
        </div>
      </ClayCard>

      {/* Add Expense Modal */}
      <ClayModal
        isOpen={addExpenseModal}
        onClose={() => setAddExpenseModal(false)}
        title="Add New Expense"
        className="w-full max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Date</label>
            <ClayInput
              type="date"
              value={newExpense.expense_date}
              onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
            >
              <option value="">Select category</option>
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <ClayInput
              placeholder="Enter description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Amount (IQD)</label>
            <ClayInput
              type="number"
              placeholder="0"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Paid From Vault</label>
            <select
              value={newExpense.vault_id}
              onChange={(e) => setNewExpense({ ...newExpense, vault_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
            >
              <option value="">Select vault</option>
              <option value="1">Main Cash Drawer</option>
              <option value="2">USD Vault</option>
              <option value="3">Digital Wallet</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <ClayButton variant="ghost" className="flex-1" onClick={() => setAddExpenseModal(false)}>
              Cancel
            </ClayButton>
            <ClayButton variant="primary" className="flex-1" onClick={handleAddExpense}>
              Add Expense
            </ClayButton>
          </div>
        </div>
      </ClayModal>
    </div>
  );
}
