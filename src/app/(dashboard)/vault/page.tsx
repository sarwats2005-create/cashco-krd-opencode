'use client';

import { useState } from 'react';
import { Wallet, Plus, Lock, Unlock, ArrowUpRight, ArrowDownRight, FileText, MoreVertical } from 'lucide-react';
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

  const cardStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: '#F5F6F7',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
  };

  const primaryButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#6C63FF',
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const buttonStyle = (variant: string = 'default'): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: variant === 'danger' ? '#E74C3C' : variant === 'success' ? '#27AE60' : '#F5F6F7',
    color: variant === 'danger' || variant === 'success' ? 'white' : '#2F2F33',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    flex: variant === 'danger' ? 'none' : 1,
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

  const typeButtonStyle = (isActive: boolean, type: 'credit' | 'debit'): React.CSSProperties => ({
    padding: '12px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? (type === 'credit' ? '#27AE60' : '#E74C3C') : '#F5F6F7',
    color: isActive ? 'white' : '#2F2F33',
    fontSize: '14px',
    fontWeight: 500,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Money Vault</h1>
          <p style={{ color: 'rgba(47,47,51,0.6)' }}>Manage your cash and transactions</p>
        </div>
        <button style={primaryButtonStyle} onClick={() => setOpenVaultModal(true)}>
          <Plus size={16} />
          Open Vault
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(108,99,255,0.1)' }}>
            <Wallet size={24} color="#6C63FF" />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Active Balance</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6C63FF' }}>{formatCurrency(totalBalance)}</p>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(39,174,96,0.1)' }}>
            <Unlock size={24} color="#27AE60" />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Open Vaults</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#27AE60' }}>{activeVaults.length}</p>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(231,76,60,0.1)' }}>
            <Lock size={24} color="#E74C3C" />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Closed Vaults</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#E74C3C' }}>{mockVaults.filter(v => v.status === 'closed').length}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {mockVaults.map((vault) => (
          <div key={vault.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2F2F33' }}>{vault.name}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>{vault.currency_base}</p>
              </div>
              <span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, backgroundColor: vault.status === 'open' ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)', color: vault.status === 'open' ? '#27AE60' : '#E74C3C' }}>
                {vault.status === 'open' ? 'Open' : 'Closed'}
              </span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>{formatCurrency(vault.current_balance, vault.currency_base)}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {vault.status === 'open' ? (
                <>
                  <button style={{ ...buttonStyle('primary'), flex: 1 }} onClick={() => { setSelectedVault(vault); setTransactionModal(true); }}>
                    Add Transaction
                  </button>
                  <button style={buttonStyle('danger')} onClick={() => { setSelectedVault(vault); setCloseVaultModal(true); }}>
                    Close
                  </button>
                </>
              ) : (
                <button style={{ ...buttonStyle('primary'), width: '100%' }}>Reopen</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2F2F33' }}>Recent Transactions</h2>
          <button style={{ ...buttonStyle(), padding: '8px 12px' }}>
            <FileText size={16} />
            Generate Report
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockTransactions.map((tx) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '14px', backgroundColor: '#F5F6F7', borderLeft: `4px solid ${tx.type === 'credit' ? '#27AE60' : '#E74C3C'}` }}>
              <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: tx.type === 'credit' ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)' }}>
                {tx.type === 'credit' ? <ArrowUpRight size={16} color="#27AE60" /> : <ArrowDownRight size={16} color="#E74C3C" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#2F2F33' }}>{tx.description}</p>
                <p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{tx.category} - {tx.performed_by}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: tx.type === 'credit' ? '#27AE60' : '#E74C3C' }}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{formatDate(tx.recorded_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openVaultModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Open New Vault</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Vault Name</label>
                <input style={inputStyle} placeholder="e.g., Main Cash Drawer" />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Opening Balance (IQD)</label>
                <input type="number" style={inputStyle} placeholder="0" />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Notes (Optional)</label>
                <textarea style={{ ...inputStyle, minHeight: '80px' }} placeholder="Add any notes..." />
              </div>
              <button style={primaryButtonStyle} onClick={() => setOpenVaultModal(false)}>Open Vault</button>
            </div>
          </div>
        </div>
      )}

      {closeVaultModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Close Vault</h2>
            <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#F5F6F7', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Opening Balance</span>
                <span style={{ fontWeight: 500 }}>{formatCurrency(selectedVault?.current_balance || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Credits</span>
                <span style={{ fontWeight: 500, color: '#27AE60' }}>+{formatCurrency(350000)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Debits</span>
                <span style={{ fontWeight: 500, color: '#E74C3C' }}>-{formatCurrency(150000)}</span>
              </div>
              <div style={{ borderTop: '1px solid #E0E0E0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Expected Balance</span>
                <span>{formatCurrency(selectedVault?.current_balance || 0)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Actual Physical Count</label>
                <input type="number" style={inputStyle} placeholder="Enter actual count" />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Closing Notes</label>
                <textarea style={{ ...inputStyle, minHeight: '80px' }} placeholder="Add closing notes..." />
              </div>
              <button style={buttonStyle('danger')} onClick={() => setCloseVaultModal(false)}>Close Vault</button>
            </div>
          </div>
        </div>
      )}

      {transactionModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Add Transaction</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button style={typeButtonStyle(transactionType === 'credit', 'credit')} onClick={() => setTransactionType('credit')}>
                <ArrowUpRight size={16} />
                Credit (+)
              </button>
              <button style={typeButtonStyle(transactionType === 'debit', 'debit')} onClick={() => setTransactionType('debit')}>
                <ArrowDownRight size={16} />
                Debit (-)
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Amount (IQD)</label>
                <input type="number" style={inputStyle} placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Category</label>
                <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
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
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Description</label>
                <input style={inputStyle} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <button style={transactionType === 'credit' ? buttonStyle('success') : buttonStyle('danger')} onClick={() => setTransactionModal(false)}>
                {transactionType === 'credit' ? 'Add Credit' : 'Add Debit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
