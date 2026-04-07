'use client';

import { useState } from 'react';
import { Receipt, Plus, Search, Download, Calendar } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';
import { showToast } from '@/store/toastStore';
import { formatCurrency, formatDate } from '@/utils/currency';

const categories = ['All', 'Rent', 'Utilities', 'Salaries', 'Supplies', 'Maintenance', 'Transport', 'Marketing', 'Equipment', 'Other'];

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense } = useExpenseStore();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ category: 'Utilities', description: '', amount: 0, vaultName: 'Main Cash Drawer', paidBy: 'Admin', date: new Date().toISOString().split('T')[0] });

  const filtered = expenses.filter(e => {
    const s = e.description.toLowerCase().includes(search.toLowerCase());
    const c = cat === 'All' || e.category === cat;
    return s && c;
  });

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const handleAdd = () => {
    if (!form.description || form.amount <= 0) { showToast('Fill required fields', 'error'); return; }
    addExpense({ ...form, currency: 'IQD' });
    showToast('Expense added!', 'success');
    setAddModal(false);
    setForm({ category: 'Utilities', description: '', amount: 0, vaultName: 'Main Cash Drawer', paidBy: 'Admin', date: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    showToast('Expense deleted!', 'success');
  };

  const cardStyle: React.CSSProperties = { padding: '16px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', backgroundColor: '#F5F6F7', borderRadius: '16px', border: '1px solid transparent', outline: 'none', fontSize: '14px' };
  const btn = (primary = false): React.CSSProperties => ({ padding: '8px 16px', borderRadius: '14px', border: 'none', backgroundColor: primary ? '#6C63FF' : '#F5F6F7', color: primary ? 'white' : '#2F2F33', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' });
  const filterBtn = (active: boolean): React.CSSProperties => ({ padding: '6px 14px', fontSize: '14px', borderRadius: '999px', border: 'none', cursor: 'pointer', backgroundColor: active ? '#6C63FF' : '#F5F6F7', color: active ? 'white' : 'rgba(47,47,51,0.6)', whiteSpace: 'nowrap' });

  const Modal = ({ open, onClose, title, children }: any) => open ? (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>{title}</h2>{children}
      </div>
    </div>
  ) : null;
  const Field = ({ label, children }: any) => <div style={{ marginBottom: '12px' }}><label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>{label}</label>{children}</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div><h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Expenses</h1><p style={{ color: 'rgba(47,47,51,0.6)' }}>Track and manage business expenses</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={btn()} onClick={() => { const csv = expenses.map(e => `${e.date},${e.category},${e.description},${e.amount}`).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click(); showToast('Exported!', 'success'); }}><Download size={16} /> Export</button>
          <button style={btn(true)} onClick={() => setAddModal(true)}><Plus size={16} /> Add Expense</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><Receipt size={32} color="#6C63FF" /><div><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{expenses.length}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Expenses</p></div></div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><DollarSign size={32} color="#E74C3C" /><div><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#E74C3C' }}>{formatCurrency(total)}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Amount</p></div></div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}><div style={{ position: 'relative', flex: '1 1 200px' }}><Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(47,47,51,0.4)' }} /><input type="text" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} /></div></div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{categories.map(c => <button key={c} onClick={() => setCat(c)} style={filterBtn(cat === c)}>{c}</button>)}</div>
      </div>

      <div style={{ ...cardStyle, marginTop: '24px', padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F5F6F7' }}><tr><th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Date</th><th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Category</th><th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Description</th><th style={{ textAlign: 'right', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Amount</th><th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Vault</th><th style={{ textAlign: 'left', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Paid By</th><th style={{ textAlign: 'center', padding: '16px', fontSize: '14px', fontWeight: 500, color: 'rgba(47,47,51,0.6)' }}>Actions</th></tr></thead>
            <tbody>{filtered.map(exp => (
              <tr key={exp.id} style={{ borderTop: '1px solid #E0E0E0' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} color="rgba(47,47,51,0.4)" />{formatDate(exp.date)}</div></td>
                <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, backgroundColor: 'rgba(108,99,255,0.1)', color: '#6C63FF' }}>{exp.category}</span></td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{exp.description}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}><p style={{ fontSize: '14px', fontWeight: 'bold', color: '#E74C3C' }}>{formatCurrency(exp.amount, exp.currency)}</p></td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{exp.vaultName}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{exp.paidBy}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><button onClick={() => handleDelete(exp.id)} style={{ padding: '8px', borderRadius: '10px', border: 'none', backgroundColor: 'rgba(231,76,60,0.1)', cursor: 'pointer' }}><Receipt size={16} color="#E74C3C" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between' }}><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Showing {filtered.length} of {expenses.length}</p><p style={{ fontSize: '14px', fontWeight: 'bold' }}>Total: <span style={{ color: '#E74C3C' }}>{formatCurrency(filtered.reduce((s, e) => s + e.amount, 0))}</span></p></div>
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Expense">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Field label="Date"><input type="date" style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Category"><select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
          <Field label="Description"><input style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Enter description" /></Field>
          <Field label="Amount (IQD)"><input type="number" style={inputStyle} value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} /></Field>
          <Field label="Vault"><select style={inputStyle} value={form.vaultName} onChange={e => setForm({ ...form, vaultName: e.target.value })}><option value="Main Cash Drawer">Main Cash Drawer</option><option value="Digital Wallet">Digital Wallet</option></select></Field>
          <div style={{ display: 'flex', gap: '8px' }}><button style={{ ...btn(), flex: 1 }} onClick={() => setAddModal(false)}>Cancel</button><button style={{ ...btn(true), flex: 1 }} onClick={handleAdd}>Add</button></div>
        </div>
      </Modal>
    </div>
  );
}
