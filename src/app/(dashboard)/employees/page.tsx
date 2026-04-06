'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, MoreVertical, Phone, Mail, DollarSign, Clock } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';
import { ClayBadge } from '@/components/ui/clay/ClayBadge';
import { ClayModal } from '@/components/ui/clay/ClayModal';
import { ClayInput } from '@/components/ui/clay/ClayInput';
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
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    phone: '',
    email: '',
    job_title: '',
    department: '',
    salary_base: 0,
  });

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.dynamic_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeCount = mockEmployees.filter(e => e.status === 'active').length;
  const onLeaveCount = mockEmployees.filter(e => e.status === 'on_leave').length;
  const totalSalary = mockEmployees.filter(e => e.status === 'active').reduce((sum, e) => sum + e.salary_base, 0);

  const handleAddEmployee = () => {
    setAddEmployeeModal(false);
    setNewEmployee({
      full_name: '',
      phone: '',
      email: '',
      job_title: '',
      department: '',
      salary_base: 0,
    });
  };

  const handleAdvanceRequest = (employee: Employee) => {
    setSelectedEmployee(employee);
    setAdvanceModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F2F33]">Employees</h1>
          <p className="text-[#2F2F33]/60">Manage your team members</p>
        </div>
        <ClayButton variant="primary" onClick={() => setAddEmployeeModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </ClayButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <ClayCard className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-[#6C63FF]" />
            <div>
              <p className="text-2xl font-bold">{mockEmployees.length}</p>
              <p className="text-sm text-[#2F2F33]/60">Total Employees</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#27AE60]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#27AE60]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#27AE60]">{activeCount}</p>
              <p className="text-sm text-[#2F2F33]/60">Active</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#F39C12]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#F39C12]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F39C12]">{onLeaveCount}</p>
              <p className="text-sm text-[#2F2F33]/60">On Leave</p>
            </div>
          </div>
        </ClayCard>
        <ClayCard className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-[#6C63FF]" />
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalSalary)}</p>
              <p className="text-sm text-[#2F2F33]/60">Monthly Total</p>
            </div>
          </div>
        </ClayCard>
      </div>

      {/* Filters */}
      <ClayCard className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2F2F33]/40" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6F7] rounded-[14px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-1.5 text-sm rounded-[999px] whitespace-nowrap transition-colors ${
                  selectedDept === dept
                    ? 'bg-[#6C63FF] text-white'
                    : 'bg-[#F5F6F7] text-[#2F2F33]/60 hover:bg-[#E0E0E0]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 text-sm rounded-[10px] whitespace-nowrap transition-colors ${
                  selectedStatus === status
                    ? 'bg-[#6C63FF] text-white'
                    : 'bg-[#F5F6F7] text-[#2F2F33]/60'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </ClayCard>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ClayCard className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-[16px] bg-[#6C63FF] flex items-center justify-center text-white font-bold text-xl">
                  {employee.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#2F2F33]">{employee.full_name}</h3>
                      <p className="text-sm text-[#2F2F33]/60">{employee.dynamic_id}</p>
                    </div>
                    <button className="p-1 rounded-[8px] hover:bg-[#F5F6F7]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm mt-1">{employee.job_title}</p>
                  <p className="text-xs text-[#2F2F33]/60">{employee.department}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E0E0E0] space-y-2">
                {employee.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-[#2F2F33]/40" />
                    <span className="text-[#2F2F33]/60">{employee.phone}</span>
                  </div>
                )}
                {employee.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-[#2F2F33]/40" />
                    <span className="text-[#2F2F33]/60 truncate">{employee.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-[#2F2F33]/40" />
                  <span className="font-medium">{formatCurrency(employee.salary_base)}/month</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <ClayBadge 
                  variant={employee.status === 'active' ? 'success' : employee.status === 'on_leave' ? 'warning' : 'danger'}
                >
                  {employee.status === 'active' ? 'Active' : employee.status === 'on_leave' ? 'On Leave' : 'Terminated'}
                </ClayBadge>
                {employee.status === 'active' && (
                  <button 
                    onClick={() => handleAdvanceRequest(employee)}
                    className="text-sm text-[#6C63FF] hover:underline"
                  >
                    Request Advance
                  </button>
                )}
              </div>
            </ClayCard>
          </motion.div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <ClayCard className="p-12 text-center">
          <Users className="w-12 h-12 text-[#2F2F33]/40 mx-auto mb-4" />
          <p className="text-[#2F2F33]/60">No employees found</p>
        </ClayCard>
      )}

      {/* Add Employee Modal */}
      <ClayModal
        isOpen={addEmployeeModal}
        onClose={() => setAddEmployeeModal(false)}
        title="Add New Employee"
        className="w-full max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <ClayInput
              placeholder="Enter full name"
              value={newEmployee.full_name}
              onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F2F33]/40">+964</span>
                <ClayInput
                  placeholder="7501234567"
                  className="pl-14"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <ClayInput
                type="email"
                placeholder="email@example.com"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Job Title</label>
              <ClayInput
                placeholder="e.g., Cashier"
                value={newEmployee.job_title}
                onChange={(e) => setNewEmployee({ ...newEmployee, job_title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <select
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
              >
                <option value="">Select department</option>
                {departments.filter(d => d !== 'All').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Monthly Salary (IQD)</label>
            <ClayInput
              type="number"
              placeholder="0"
              value={newEmployee.salary_base}
              onChange={(e) => setNewEmployee({ ...newEmployee, salary_base: Number(e.target.value) })}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <ClayButton variant="ghost" className="flex-1" onClick={() => setAddEmployeeModal(false)}>
              Cancel
            </ClayButton>
            <ClayButton variant="primary" className="flex-1" onClick={handleAddEmployee}>
              Add Employee
            </ClayButton>
          </div>
        </div>
      </ClayModal>

      {/* Advance Request Modal */}
      <ClayModal
        isOpen={advanceModal}
        onClose={() => setAdvanceModal(false)}
        title="Request Advance"
        className="w-full max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-[16px] bg-[#F5F6F7]">
            <p className="font-medium">{selectedEmployee?.full_name}</p>
            <p className="text-sm text-[#2F2F33]/60">{selectedEmployee?.job_title}</p>
            <p className="text-sm text-[#2F2F33]/60">Salary: {formatCurrency(selectedEmployee?.salary_base || 0)}/month</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Amount (IQD)</label>
            <ClayInput type="number" placeholder="Enter amount" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Reason</label>
            <textarea
              className="w-full px-4 py-3 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
              rows={3}
              placeholder="Enter reason..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Payout Type</label>
            <div className="flex gap-2">
              <button className="flex-1 p-3 rounded-[14px] text-sm font-medium bg-[#6C63FF] text-white">
                Cash Out
              </button>
              <button className="flex-1 p-3 rounded-[14px] text-sm font-medium bg-[#F5F6F7] text-[#2F2F33]">
                Salary Deduction
              </button>
            </div>
          </div>
          <ClayButton variant="primary" className="w-full">
            Submit Request
          </ClayButton>
        </div>
      </ClayModal>
    </div>
  );
}
