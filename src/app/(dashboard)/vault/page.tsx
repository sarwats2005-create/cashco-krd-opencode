'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Minus, Lock, Unlock, ArrowUpRight, ArrowDownRight, FileText, MoreVertical } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';
import { ClayBadge } from '@/components/ui/clay/ClayBadge';
import { ClayModal } from '@/components/ui/clay/ClayModal';
import { ClayInput } from '@/components/ui/clay/ClayInput';
import { formatCurrency, formatDate } from '@/utils/currency';

interface Vault {
  id: string;
  name: string;
  currency_base: string;
  current_balance: number;
  status: 'open' | 'closed';
  last_activity?: string;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  category: string;
  description: string;
  performed_by: string;
  recorded_at: string;
}

const mockVaults: Vault[] = [
  { id: '1', name: 'Main Cash Drawer', currency_base: 'IQD', current_balance: 4500000, status: 'open', last_activity: new Date().toISOString() },
  { id: '2', name: 'USD Vault', currency_base: 'USD', current_balance: 1500, status: 'closed', last_activity: new Date().toISOString() },
  { id: '3', name: 'Digital Wallet', currency_base: 'IQD', current_balance: 2500000, status: 'open', last_activity: new Date().toISOString() },
];

const mockTransactions: Transaction[] = [
  { id: '1', type: 'credit', amount: 250000, currency: 'IQD', category: 'Sales Income', description: 'POS Sale #1234', performed_by: 'Ahmed', recorded_at: new Date().toISOString() },
  { id: '2', type: 'debit', amount: 50000, currency: 'IQD', category: 'Expense', description: 'Office supplies', performed_by: 'Sara', recorded_at: new Date().toISOString() },
  { id: '3', type: 'credit', amount: 150000, currency: 'IQD', category: 'Sales Income', description: 'POS Sale #1233', performed_by: 'Ahmed', recorded_at: new Date().toISOString() },
  { id: '4', type: 'debit', amount: 100000, currency: 'IQD', category: 'Employee Advance', description: 'Advance for Omar', performed_by: 'Admin', recorded_at: new Date().toISOString() },
  { id: '5', type: 'debit', amount: 200000, currency: 'IQD', category: 'Petty Cash', description: 'Transport expense', performed_by: 'Ahmed', recorded_at: new Date().toISOString() },
];

export default function VaultPage() {
  const [openVaultModal, setOpenVaultModal] = useState(false);
  const [closeVaultModal, setCloseVaultModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const activeVaults = mockVaults.filter(v => v.status === 'open');
  const totalBalance = activeVaults.reduce((sum, v) => sum + v.current_balance, 0);

  const handleOpenVault = () => {
    setOpenVaultModal(false);
  };

  const handleCloseVault = () => {
    setCloseVaultModal(false);
  };

  const handleTransaction = () => {
    setTransactionModal(false);
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F2F33]">Money Vault</h1>
          <p className="text-[#2F2F33]/60">Manage your cash and transactions</p>
        </div>
        <div className="flex gap-2">
          <ClayButton variant="primary" onClick={() => setOpenVaultModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Open Vault
          </ClayButton>
        </div>
      </div>

      {/* Vault Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ClayCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[16px] bg-[#6C63FF]/10">
              <Wallet className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <div>
              <p className="text-sm text-[#2F2F33]/60">Total Active Balance</p>
              <p className="text-2xl font-bold text-[#6C63FF]">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[16px] bg-[#27AE60]/10">
              <Unlock className="w-6 h-6 text-[#27AE60]" />
            </div>
            <div>
              <p className="text-sm text-[#2F2F33]/60">Open Vaults</p>
              <p className="text-2xl font-bold text-[#27AE60]">{activeVaults.length}</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[16px] bg-[#E74C3C]/10">
              <Lock className="w-6 h-6 text-[#E74C3C]" />
            </div>
            <div>
              <p className="text-sm text-[#2F2F33]/60">Closed Vaults</p>
              <p className="text-2xl font-bold text-[#E74C3C]">{mockVaults.filter(v => v.status === 'closed').length}</p>
            </div>
          </div>
        </ClayCard>
      </div>

      {/* Vault Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockVaults.map((vault) => (
          <ClayCard key={vault.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#2F2F33]">{vault.name}</h3>
                <p className="text-sm text-[#2F2F33]/60">{vault.currency_base}</p>
              </div>
              <ClayBadge variant={vault.status === 'open' ? 'success' : 'danger'}>
                {vault.status === 'open' ? 'Open' : 'Closed'}
              </ClayBadge>
            </div>
            <p className="text-2xl font-bold mb-4">{formatCurrency(vault.current_balance, vault.currency_base)}</p>
            <div className="flex gap-2">
              {vault.status === 'open' ? (
                <>
                  <ClayButton 
                    variant="primary" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedVault(vault);
                      setTransactionModal(true);
                    }}
                  >
                    Add Transaction
                  </ClayButton>
                  <ClayButton 
                    variant="danger" 
                    size="sm"
                    onClick={() => {
                      setSelectedVault(vault);
                      setCloseVaultModal(true);
                    }}
                  >
                    Close
                  </ClayButton>
                </>
              ) : (
                <ClayButton variant="primary" size="sm" className="w-full">
                  Reopen
                </ClayButton>
              )}
            </div>
          </ClayCard>
        ))}
      </div>

      {/* Transaction History */}
      <ClayCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2F2F33]">Recent Transactions</h2>
          <ClayButton variant="ghost" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </ClayButton>
        </div>
        <div className="space-y-3">
          {mockTransactions.map((tx, index) => (
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
              <div className="text-right">
                <p className={`font-bold ${tx.type === 'credit' ? 'text-[#27AE60]' : 'text-[#E74C3C]'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                </p>
                <p className="text-xs text-[#2F2F33]/60">{formatDate(tx.recorded_at)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ClayCard>

      {/* Open Vault Modal */}
      <ClayModal
        isOpen={openVaultModal}
        onClose={() => setOpenVaultModal(false)}
        title="Open New Vault"
        className="w-full max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Vault Name</label>
            <ClayInput placeholder="e.g., Main Cash Drawer" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Opening Balance (IQD)</label>
            <ClayInput type="number" placeholder="0" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Notes (Optional)</label>
            <textarea 
              className="w-full px-4 py-3 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
              rows={3}
              placeholder="Add any notes..."
            />
          </div>
          <ClayButton variant="primary" className="w-full" onClick={handleOpenVault}>
            Open Vault
          </ClayButton>
        </div>
      </ClayModal>

      {/* Close Vault Modal */}
      <ClayModal
        isOpen={closeVaultModal}
        onClose={() => setCloseVaultModal(false)}
        title="Close Vault"
        className="w-full max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-[16px] bg-[#F5F6F7] space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#2F2F33]/60">Opening Balance</span>
              <span className="font-medium">{formatCurrency(selectedVault?.current_balance || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#2F2F33]/60">Total Credits</span>
              <span className="font-medium text-[#27AE60]">+{formatCurrency(350000)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#2F2F33]/60">Total Debits</span>
              <span className="font-medium text-[#E74C3C]">-{formatCurrency(150000)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Expected Balance</span>
              <span>{formatCurrency(selectedVault?.current_balance || 0)}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Actual Physical Count</label>
            <ClayInput type="number" placeholder="Enter actual count" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Closing Notes</label>
            <textarea 
              className="w-full px-4 py-3 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
              rows={3}
              placeholder="Add closing notes..."
            />
          </div>
          <ClayButton variant="danger" className="w-full" onClick={handleCloseVault}>
            Close Vault
          </ClayButton>
        </div>
      </ClayModal>

      {/* Transaction Modal */}
      <ClayModal
        isOpen={transactionModal}
        onClose={() => setTransactionModal(false)}
        title="Add Transaction"
        className="w-full max-w-md"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTransactionType('credit')}
              className={`flex-1 p-3 rounded-[14px] text-sm font-medium transition-colors ${
                transactionType === 'credit'
                  ? 'bg-[#27AE60] text-white'
                  : 'bg-[#F5F6F7] text-[#2F2F33]'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 inline mr-1" />
              Credit (+)
            </button>
            <button
              onClick={() => setTransactionType('debit')}
              className={`flex-1 p-3 rounded-[14px] text-sm font-medium transition-colors ${
                transactionType === 'debit'
                  ? 'bg-[#E74C3C] text-white'
                  : 'bg-[#F5F6F7] text-[#2F2F33]'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 inline mr-1" />
              Debit (-)
            </button>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Amount (IQD)</label>
            <ClayInput 
              type="number" 
              placeholder="0" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
            >
              <option value="">Select category</option>
              <option value="sales">Sales Income</option>
              <option value="expense">Expense</option>
              <option value="advance">Employee Advance</option>
              <option value="supplier">Supplier Payment</option>
              <option value="petty">Petty Cash</option>
              <option value="transfer">Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <ClayInput 
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <ClayButton variant={transactionType === 'credit' ? 'success' : 'danger'} className="w-full" onClick={handleTransaction}>
            {transactionType === 'credit' ? 'Add Credit' : 'Add Debit'}
          </ClayButton>
        </div>
      </ClayModal>
    </div>
  );
}
