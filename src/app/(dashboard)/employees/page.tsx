'use client';

import { useState } from 'react';
import { Users, Plus, Search, Phone, Mail, DollarSign, Clock, Trash2, Edit2 } from 'lucide-react';
import { useEmployeeStore } from '@/store/employeeStore';
import { showToast } from '@/store/toastStore';
import { formatCurrency } from '@/utils/currency';

const departments = ['All', 'Sales', 'Finance', 'Warehouse', 'Operations'];

export default function EmployeesPage() {
  const { employees, advances, addEmployee, updateEmployee, deleteEmployee, requestAdvance } = useEmployeeStore();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [status, setStatus] = useState('all');
  const [addModal, setAddModal] = useState(false);
  const [advModal, setAdvModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [advAmount, setAdvAmount] = useState(0);
  const [advReason, setAdvReason] = useState('');
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', jobTitle: '', department: 'Sales', salaryBase: 0 });

  const filtered = employees.filter(e => {
    const s = e.fullName.toLowerCase().includes(search.toLowerCase()) || e.dynamicId.toLowerCase().includes(search.toLowerCase());
    const d = dept === 'All' || e.department === dept;
    const st = status === 'all' || e.status === status;
    return s && d && st;
  });

  const handleAdd = () => {
    if (!form.fullName || !form.jobTitle) { showToast('Fill required fields', 'error'); return; }
    addEmployee({ ...form, hireDate: new Date().toISOString().split('T')[0], status: 'active' });
    showToast('Employee added!', 'success');
    setAddModal(false);
    setForm({ fullName: '', phone: '', email: '', jobTitle: '', department: 'Sales', salaryBase: 0 });
  };

  const handleAdvance = () => {
    if (!selectedEmp || advAmount <= 0) { showToast('Enter valid amount', 'error'); return; }
    requestAdvance({ employeeId: selectedEmp.id, employeeName: selectedEmp.fullName, amount: advAmount, reason: advReason, status: 'pending', date: new Date().toISOString() });
    showToast('Advance requested!', 'success');
    setAdvModal(false);
    setAdvAmount(0);
    setAdvReason('');
  };

  const cardStyle: React.CSSProperties = { padding: '16px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', backgroundColor: '#F5F6F7', borderRadius: '16px', border: '1px solid transparent', outline: 'none', fontSize: '14px' };
  const btn = (primary = false): React.CSSProperties => ({ padding: '8px 16px', borderRadius: '14px', border: 'none', backgroundColor: primary ? '#6C63FF' : '#F5F6F7', color: primary ? 'white' : '#2F2F33', fontSize: '14px', fontWeight: 500, cursor: 'pointer' });
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
        <div><h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Employees</h1><p style={{ color: 'rgba(47,47,51,0.6)' }}>Manage your team members</p></div>
        <button style={btn(true)} onClick={() => setAddModal(true)}><Plus size={16} /> Add Employee</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={32} color="#6C63FF" /><div><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{employees.length}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total</p></div></div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={32} color="#27AE60" /><div><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#27AE60' }}>{employees.filter(e => e.status === 'active').length}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Active</p></div></div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><Clock size={32} color="#F39C12" /><div><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F39C12' }}>{employees.filter(e => e.status === 'on_leave').length}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>On Leave</p></div></div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}><DollarSign size={32} color="#6C63FF" /><div><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatCurrency(employees.filter(e => e.status === 'active').reduce((s, e) => s + e.salaryBase, 0))}</p><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Monthly</p></div></div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}><div style={{ position: 'relative', flex: '1 1 200px' }}><Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(47,47,51,0.4)' }} /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} /></div></div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>{departments.map(d => <button key={d} onClick={() => setDept(d)} style={filterBtn(dept === d)}>{d}</button>)}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{['all', 'active', 'on_leave', 'terminated'].map(s => <button key={s} onClick={() => setStatus(s)} style={filterBtn(status === s)}>{s === 'all' ? 'All' : s === 'on_leave' ? 'On Leave' : s.charAt(0).toUpperCase() + s.slice(1)}</button>)}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
        {filtered.map(emp => (
          <div key={emp.id} style={{ ...cardStyle, display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px', flexShrink: 0 }}>{emp.fullName.split(' ').map(n => n[0]).join('')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2F2F33' }}>{emp.fullName}</h3><p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>{emp.dynamicId}</p></div>
                <span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, backgroundColor: emp.status === 'active' ? 'rgba(39,174,96,0.1)' : emp.status === 'on_leave' ? 'rgba(243,156,18,0.1)' : 'rgba(231,76,60,0.1)', color: emp.status === 'active' ? '#27AE60' : emp.status === 'on_leave' ? '#F39C12' : '#E74C3C' }}>{emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : 'Terminated'}</span>
              </div>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>{emp.jobTitle} - {emp.department}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {emp.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}><Phone size={16} color="rgba(47,47,51,0.4)" /><span style={{ color: 'rgba(47,47,51,0.6)' }}>{emp.phone}</span></div>}
                {emp.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}><Mail size={16} color="rgba(47,47,51,0.4)" /><span style={{ color: 'rgba(47,47,51,0.6)' }}>{emp.email}</span></div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}><DollarSign size={16} color="rgba(47,47,51,0.4)" /><span style={{ fontWeight: 500 }}>{formatCurrency(emp.salaryBase)}/month</span></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {emp.status === 'active' && <button onClick={() => { setSelectedEmp(emp); setAdvModal(true); }} style={{ padding: '8px 12px', borderRadius: '14px', border: 'none', backgroundColor: '#6C63FF', color: 'white', fontSize: '14px', cursor: 'pointer' }}>Request Advance</button>}
              {emp.status === 'active' ? <button onClick={() => updateEmployee(emp.id, { status: 'on_leave' })} style={{ padding: '8px 12px', borderRadius: '14px', border: 'none', backgroundColor: '#F39C12', color: 'white', fontSize: '14px', cursor: 'pointer' }}>Set On Leave</button> : emp.status === 'on_leave' ? <button onClick={() => updateEmployee(emp.id, { status: 'active' })} style={{ padding: '8px 12px', borderRadius: '14px', border: 'none', backgroundColor: '#27AE60', color: 'white', fontSize: '14px', cursor: 'pointer' }}>Activate</button> : null}
            </div>
          </div>
        ))}
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Employee">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Field label="Full Name *"><input style={inputStyle} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></Field>
          <Field label="Job Title *"><input style={inputStyle} value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} /></Field>
          <Field label="Phone"><input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Email"><input style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Department"><select style={inputStyle} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>{departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}</select></Field>
          <Field label="Salary (IQD)"><input type="number" style={inputStyle} value={form.salaryBase} onChange={e => setForm({ ...form, salaryBase: Number(e.target.value) })} /></Field>
          <div style={{ display: 'flex', gap: '8px' }}><button style={{ ...btn(), flex: 1 }} onClick={() => setAddModal(false)}>Cancel</button><button style={{ ...btn(true), flex: 1 }} onClick={handleAdd}>Add</button></div>
        </div>
      </Modal>

      <Modal open={advModal} onClose={() => setAdvModal(false)} title="Request Advance">
        <p style={{ marginBottom: '16px', fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Employee: {selectedEmp?.fullName}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Field label="Amount (IQD)"><input type="number" style={inputStyle} value={advAmount} onChange={e => setAdvAmount(Number(e.target.value))} /></Field>
          <Field label="Reason"><textarea style={{ ...inputStyle, minHeight: '80px' }} value={advReason} onChange={e => setAdvReason(e.target.value)} placeholder="Reason for advance..." /></Field>
          <button style={{ ...btn(true), width: '100%' }} onClick={handleAdvance}>Submit Request</button>
        </div>
      </Modal>
    </div>
  );
}
