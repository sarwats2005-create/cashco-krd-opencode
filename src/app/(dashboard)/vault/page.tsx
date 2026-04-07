'use client';

import { useState } from 'react';
import { Wallet, Plus, Lock, Unlock, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';
import { useVaultStore } from '@/store/vaultStore';
import { showToast } from '@/store/toastStore';
import { formatCurrency, formatDate } from '@/utils/currency';

export default function VaultPage() {
  const { vaults, transactions, addVault, openVault, closeVault, addTransaction, getTotalBalance } = useVaultStore();
  const [openModal, setOpenModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [txModal, setTxModal] = useState(false);
  const [selectedVault, setSelectedVault] = useState<any>(null);
  const [txType, setTxType] = useState<'credit' | 'debit'>('credit');
  const [form, setForm] = useState({ name: '', currency: 'IQD', openingBalance: 0, amount: 0, category: 'Sales', description: '', physicalCount: 0 });

  const handleAddVault = () => {
    if (!form.name) { showToast('Enter vault name', 'error'); return; }
    addVault({ name: form.name, currency: form.currency, openingBalance: 0, currentBalance: 0, status: 'closed' });
    showToast('Vault created!', 'success');
    setOpenModal(false);
    setForm({ name: '', currency: 'IQD', openingBalance: 0, amount: 0, category: 'Sales', description: '' });
  };

  const handleOpenVault = () => {
    if (!selectedVault) return;
    openVault(selectedVault.id, form.openingBalance);
    addTransaction({ vaultId: selectedVault.id, type: 'credit', amount: form.openingBalance, category: 'Opening', description: `Vault opened with ${formatCurrency(form.openingBalance)}`, performedBy: 'Admin', date: new Date().toISOString() });
    showToast('Vault opened!', 'success');
    setOpenModal(false);
    setForm({ name: '', currency: 'IQD', openingBalance: 0, amount: 0, category: 'Sales', description: '' });
  };

  const handleCloseVault = () => {
    if (!selectedVault) return;
    closeVault(selectedVault.id);
    addTransaction({ vaultId: selectedVault.id, type: 'debit', amount: selectedVault.currentBalance, category: 'Closing', description: `Vault closed. Balance: ${formatCurrency(selectedVault.currentBalance)}`, performedBy: 'Admin', date: new Date().toISOString() });
    showToast('Vault closed!', 'success');
    setCloseModal(false);
  };

  const handleAddTx = () => {
    if (!selectedVault || form.amount <= 0 || !form.description) { showToast('Fill all fields', 'error'); return; }
    addTransaction({ vaultId: selectedVault.id, type: txType, amount: form.amount, category: form.category, description: form.description, performedBy: 'Cashier', date: new Date().toISOString() });
    showToast(`${txType === 'credit' ? 'Credit' : 'Debit'} added!`, 'success');
    setTxModal(false);
    setForm({ name: '', currency: 'IQD', openingBalance: 0, amount: 0, category: 'Sales', description: '' });
  };

  const cardStyle: React.CSSProperties = { padding: '20px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', backgroundColor: '#F5F6F7', borderRadius: '16px', border: '1px solid transparent', outline: 'none', fontSize: '14px' };
  const btn = (variant = 'default'): React.CSSProperties => ({ padding: '8px 16px', borderRadius: '14px', border: 'none', backgroundColor: variant === 'danger' ? '#E74C3C' : variant === 'success' ? '#27AE60' : variant === 'primary' ? '#6C63FF' : '#F5F6F7', color: variant === 'default' ? '#2F2F33' : 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer' });
  const typeBtn = (active: boolean, type: 'credit' | 'debit'): React.CSSProperties => ({ padding: '12px', borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: active ? (type === 'credit' ? '#27AE60' : '#E74C3C') : '#F5F6F7', color: active ? 'white' : '#2F2F33', fontSize: '14px', fontWeight: 500, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' });

  const Modal = ({ open, onClose, title, children }: any) => open ? (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>{title}</h2>
        {children}
      </div>
    </div>
  ) : null;

  const Field = ({ label, children }: any) => <div style={{ marginBottom: '12px' }}><label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>{label}</label>{children}</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div><h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Money Vault</h1><p style={{ color: 'rgba(47,47,51,0.6)' }}>Manage your cash and transactions</p></div>
        <button style={btn('primary')} onClick={() => setOpenModal(true)}><Plus size={16} /> Create Vault</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(108,99,255,0.1)' }}><Wallet size={24} color="#6C63FF" /></div><div><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Balance</p><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6C63FF' }}>{formatCurrency(getTotalBalance())}</p></div></div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(39,174,96,0.1)' }}><Unlock size={24} color="#27AE60" /></div><div><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Open Vaults</p><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#27AE60' }}>{vaults.filter(v => v.status === 'open').length}</p></div></div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(231,76,60,0.1)' }}><Lock size={24} color="#E74C3C" /></div><div><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Closed Vaults</p><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#E74C3C' }}>{vaults.filter(v => v.status === 'closed').length}</p></div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {vaults.map((vault) => (
          <div key={vault.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div><h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2F2F33' }}>{vault.name}</h3><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>{vault.currency}</p></div>
              <span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, backgroundColor: vault.status === 'open' ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)', color: vault.status === 'open' ? '#27AE60' : '#E74C3C' }}>{vault.status === 'open' ? 'Open' : 'Closed'}</span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>{formatCurrency(vault.currentBalance, vault.currency)}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {vault.status === 'open' ? (
                <><button style={{ ...btn('primary'), flex: 1 }} onClick={() => { setSelectedVault(vault); setForm({ name: '', currency: 'IQD', openingBalance: 0, amount: 0, category: 'Sales', description: '' }); setTxModal(true); }}>Add Transaction</button><button style={btn('danger')} onClick={() => { setSelectedVault(vault); setCloseModal(true); }}>Close</button></>
              ) : (
                <button style={{ ...btn('success'), width: '100%' }} onClick={() => { setSelectedVault(vault); setForm({ ...form, openingBalance: 0 }); setOpenModal(true); }}>Reopen Vault</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}><h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2F2F33' }}>Recent Transactions</h2><button style={btn()}><FileText size={16} /> Report</button></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.slice(0, 10).map((tx) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '14px', backgroundColor: '#F5F6F7', borderLeft: `4px solid ${tx.type === 'credit' ? '#27AE60' : '#E74C3C'}` }}>
              <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: tx.type === 'credit' ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)' }}>{tx.type === 'credit' ? <ArrowUpRight size={16} color="#27AE60" /> : <ArrowDownRight size={16} color="#E74C3C" />}</div>
              <div style={{ flex: 1 }}><p style={{ fontSize: '14px', fontWeight: 500, color: '#2F2F33' }}>{tx.description}</p><p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{tx.category} - {tx.performedBy}</p></div>
              <div style={{ textAlign: 'right' }}><p style={{ fontSize: '14px', fontWeight: 'bold', color: tx.type === 'credit' ? '#27AE60' : '#E74C3C' }}>{tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}</p><p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{formatDate(tx.date)}</p></div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={selectedVault?.status === 'open' ? 'Open Vault' : 'Create Vault'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {selectedVault?.status !== 'open' && <><Field label="Vault Name"><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Main Cash Drawer" /></Field><Field label="Currency"><select style={inputStyle} value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}><option value="IQD">IQD - Iraqi Dinar</option><option value="USD">USD - US Dollar</option><option value="EUR">EUR - Euro</option></select></Field></>}
          {selectedVault?.status === 'open' ? <Field label="Opening Balance"><input type="number" style={inputStyle} value={form.openingBalance} onChange={e => setForm({ ...form, openingBalance: Number(e.target.value) })} /></Field> : null}
          <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: '80px' }} placeholder="Optional notes..." /></Field>
          <button style={btn('success')} onClick={selectedVault?.status === 'open' ? handleOpenVault : handleAddVault}>{selectedVault?.status === 'open' ? 'Open Vault' : 'Create Vault'}</button>
        </div>
      </Modal>

      <Modal open={closeModal} onClose={() => setCloseModal(false)} title="Close Vault">
        <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#F5F6F7', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Opening Balance</span><span style={{ fontWeight: 500 }}>{formatCurrency(selectedVault?.openingBalance || 0)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Current Balance</span><span style={{ fontWeight: 500, color: '#27AE60' }}>{formatCurrency(selectedVault?.currentBalance || 0)}</span></div>
        </div>
        <button style={btn('danger')} onClick={handleCloseVault}>Close Vault</button>
      </Modal>

      <Modal open={txModal} onClose={() => setTxModal(false)} title="Add Transaction">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button style={typeBtn(txType === 'credit', 'credit')} onClick={() => setTxType('credit')}><ArrowUpRight size={16} /> Credit (+)</button>
          <button style={typeBtn(txType === 'debit', 'debit')} onClick={() => setTxType('debit')}><ArrowDownRight size={16} /> Debit (-)</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Field label="Amount (IQD)"><input type="number" style={inputStyle} value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} placeholder="0" /></Field>
          <Field label="Category"><select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option value="Sales">Sales</option><option value="Expense">Expense</option><option value="Advance">Advance</option><option value="Supply">Supply</option><option value="Other">Other</option></select></Field>
          <Field label="Description"><input style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Enter description" /></Field>
          <button style={txType === 'credit' ? btn('success') : btn('danger')} onClick={handleAddTx}>{txType === 'credit' ? 'Add Credit' : 'Add Debit'}</button>
        </div>
      </Modal>
    </div>
  );
}
