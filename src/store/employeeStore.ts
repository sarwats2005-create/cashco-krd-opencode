import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Employee {
  id: string;
  dynamicId: string;
  fullName: string;
  phone: string;
  email: string;
  jobTitle: string;
  department: string;
  salaryBase: number;
  status: 'active' | 'on_leave' | 'terminated';
  hireDate: string;
}

export interface AdvanceRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface EmployeeState {
  employees: Employee[];
  advances: AdvanceRequest[];
  addEmployee: (emp: Omit<Employee, 'id' | 'dynamicId'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  requestAdvance: (adv: Omit<AdvanceRequest, 'id'>) => void;
  approveAdvance: (id: string) => void;
  rejectAdvance: (id: string) => void;
}

const defaultEmployees: Employee[] = [
  { id: '1', dynamicId: 'EMP-2024-0001', fullName: 'Ahmed Karim', phone: '+9647501234567', email: 'ahmed@example.com', jobTitle: 'Cashier', department: 'Sales', salaryBase: 400000, status: 'active', hireDate: '2024-01-15' },
  { id: '2', dynamicId: 'EMP-2024-0002', fullName: 'Sara Omar', phone: '+9647502345678', email: 'sara@example.com', jobTitle: 'Accountant', department: 'Finance', salaryBase: 600000, status: 'active', hireDate: '2024-02-01' },
  { id: '3', dynamicId: 'EMP-2024-0003', fullName: 'Omar Ali', phone: '+9647503456789', email: 'omar@example.com', jobTitle: 'Warehouse Staff', department: 'Warehouse', salaryBase: 350000, status: 'active', hireDate: '2024-03-10' },
  { id: '4', dynamicId: 'EMP-2024-0004', fullName: 'Lana Khalid', phone: '+9647504567890', email: 'lana@example.com', jobTitle: 'Manager', department: 'Operations', salaryBase: 800000, status: 'on_leave', hireDate: '2023-06-20' },
  { id: '5', dynamicId: 'EMP-2024-0005', fullName: 'John Baba', phone: '+9647505678901', email: 'john@example.com', jobTitle: 'Cashier', department: 'Sales', salaryBase: 400000, status: 'active', hireDate: '2024-04-05' },
];

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set) => ({
      employees: defaultEmployees,
      advances: [],
      addEmployee: (emp) => set((state) => {
        const newId = Date.now().toString();
        const year = new Date().getFullYear();
        const seq = state.employees.length + 1;
        return {
          employees: [...state.employees, { ...emp, id: newId, dynamicId: `EMP-${year}-${seq.toString().padStart(4, '0')}` }],
        };
      }),
      updateEmployee: (id, updates) => set((state) => ({
        employees: state.employees.map((e) => e.id === id ? { ...e, ...updates } : e),
      })),
      deleteEmployee: (id) => set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
      })),
      requestAdvance: (adv) => set((state) => ({
        advances: [...state.advances, { ...adv, id: Date.now().toString() }],
      })),
      approveAdvance: (id) => set((state) => ({
        advances: state.advances.map((a) => a.id === id ? { ...a, status: 'approved' as const } : a),
      })),
      rejectAdvance: (id) => set((state) => ({
        advances: state.advances.map((a) => a.id === id ? { ...a, status: 'rejected' as const } : a),
      })),
    }),
    { name: 'cashco-employees' }
  )
);
