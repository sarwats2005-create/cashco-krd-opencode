'use client';

import { useState } from 'react';
import { Users, Plus, Search, MoreVertical, Phone, Mail, DollarSign, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/currency';

interface Employee {
  id: string;
  dynamic_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  job_title: string;
  department?: string;
  salary_base: number;
  status: 'active' | 'on_leave' | 'terminated';
  hire_date: string;
  photo_url?: string;
}

const mockEmployees: Employee[] = [
  { id: '1', dynamic_id: 'EMP-2024-0001', full_name: 'Ahmed Karim', phone: '+9647501234567', email: 'ahmed@example.com', job_title: 'Cashier', department: 'Sales', salary_base: 400000, status: 'active', hire_date: '2024-01-15' },
  { id: '2', dynamic_id: 'EMP-2024-0002', full_name: 'Sara Omar', phone: '+9647502345678', email: 'sara@example.com', job_title: 'Accountant', department: 'Finance', salary_base: 600000, status: 'active', hire_date: '2024-02-01' },
  { id: '3', dynamic_id: 'EMP-2024-0003', full_name: 'Omar Ali', phone: '+9647503456789', email: 'omar@example.com', job_title: 'Warehouse Staff', department: 'Warehouse', salary_base: 350000, status: 'active', hire_date: '2024-03-10' },
  { id: '4', dynamic_id: 'EMP-2024-0004', full_name: 'Lana Khalid', phone: '+9647504567890', email: 'lana@example.com', job_title: 'Manager', department: 'Operations', salary_base: 800000, status: 'on_leave', hire_date: '2023-06-20' },
  { id: '5', dynamic_id: 'EMP-2024-0005', full_name: 'John Baba', phone: '+9647505678901', email: 'john@example.com', job_title: 'Cashier', department: 'Sales', salary_base: 400000, status: 'active', hire_date: '2024-04-05' },
];

const departments = ['All', 'Sales', 'Finance', 'Warehouse', 'Operations'];
const statuses = ['all', 'active', 'on_leave', 'terminated'];

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [addEmployeeModal, setAddEmployeeModal] = useState(false);
  const [advanceModal, setAdvanceModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({ full_name: '', phone: '', email: '', job_title: '', department: '', salary_base: 0 });

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.dynamic_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeCount = mockEmployees.filter(e => e.status === 'active').length;
  const onLeaveCount = mockEmployees.filter(e => e.status === 'on_leave').length;
  const totalSalary = mockEmployees.filter(e => e.status === 'active').reduce((sum, e) => sum + e.salary_base, 0);

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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Employees</h1>
          <p style={{ color: 'rgba(47,47,51,0.6)' }}>Manage your team members</p>
        </div>
        <button style={buttonStyle(true)} onClick={() => setAddEmployeeModal(true)}>
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={32} color="#6C63FF" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{mockEmployees.length}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Total Employees</p>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={32} color="#27AE60" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#27AE60' }}>{activeCount}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Active</p>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={32} color="#F39C12" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F39C12' }}>{onLeaveCount}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>On Leave</p>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DollarSign size={32} color="#6C63FF" />
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatCurrency(totalSalary)}</p>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>Monthly Total</p>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(47,47,51,0.4)' }} />
            <input type="text" placeholder="Search by name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {departments.map(dept => (
            <button key={dept} onClick={() => setSelectedDept(dept)} style={filterButtonStyle(selectedDept === dept)}>{dept}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {statuses.map(status => (
            <button key={status} onClick={() => setSelectedStatus(status)} style={filterButtonStyle(selectedStatus === status)}>
              {status === 'all' ? 'All' : status === 'on_leave' ? 'On Leave' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginTop: '24px' }}>
        {filteredEmployees.map((employee) => (
          <div key={employee.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
                {employee.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2F2F33' }}>{employee.full_name}</h3>
                    <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)' }}>{employee.dynamic_id}</p>
                  </div>
                  <button style={{ padding: '4px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
                <p style={{ fontSize: '14px', marginTop: '4px' }}>{employee.job_title}</p>
                <p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{employee.department}</p>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E0E0E0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {employee.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <Phone size={16} color="rgba(47,47,51,0.4)" />
                  <span style={{ color: 'rgba(47,47,51,0.6)' }}>{employee.phone}</span>
                </div>
              )}
              {employee.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <Mail size={16} color="rgba(47,47,51,0.4)" />
                  <span style={{ color: 'rgba(47,47,51,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.email}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <DollarSign size={16} color="rgba(47,47,51,0.4)" />
                <span style={{ fontWeight: 500 }}>{formatCurrency(employee.salary_base)}/month</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, backgroundColor: employee.status === 'active' ? 'rgba(39,174,96,0.1)' : employee.status === 'on_leave' ? 'rgba(243,156,18,0.1)' : 'rgba(231,76,60,0.1)', color: employee.status === 'active' ? '#27AE60' : employee.status === 'on_leave' ? '#F39C12' : '#E74C3C' }}>
                {employee.status === 'active' ? 'Active' : employee.status === 'on_leave' ? 'On Leave' : 'Terminated'}
              </span>
              {employee.status === 'active' && (
                <button onClick={() => { setSelectedEmployee(employee); setAdvanceModal(true); }} style={{ fontSize: '14px', color: '#6C63FF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Request Advance
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {addEmployeeModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Add New Employee</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input style={inputStyle} placeholder="Full Name" value={newEmployee.full_name} onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })} />
              <input style={inputStyle} placeholder="Phone" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
              <input style={inputStyle} placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
              <input style={inputStyle} placeholder="Job Title" value={newEmployee.job_title} onChange={(e) => setNewEmployee({ ...newEmployee, job_title: e.target.value })} />
              <select style={inputStyle} value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}>
                <option value="">Select Department</option>
                {departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="number" style={inputStyle} placeholder="Salary (IQD)" value={newEmployee.salary_base} onChange={(e) => setNewEmployee({ ...newEmployee, salary_base: Number(e.target.value) })} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ ...buttonStyle(), flex: 1 }} onClick={() => setAddEmployeeModal(false)}>Cancel</button>
                <button style={{ ...buttonStyle(true), flex: 1 }} onClick={() => setAddEmployeeModal(false)}>Add Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {advanceModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Request Advance</h2>
            <p style={{ fontSize: '14px', color: 'rgba(47,47,51,0.6)', marginBottom: '16px' }}>Employee: {selectedEmployee?.full_name}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="number" style={inputStyle} placeholder="Amount (IQD)" />
              <textarea style={{ ...inputStyle, minHeight: '80px' }} placeholder="Reason for advance..." />
              <button style={{ ...buttonStyle(true), width: '100%' }} onClick={() => setAdvanceModal(false)}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
