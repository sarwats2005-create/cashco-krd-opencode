export interface Organization {
  id: string;
  owner_id: string;
  name: string;
  category: string;
  logo_url?: string;
  phone?: string;
  address?: string;
  caption?: string;
  website?: string;
  settings: Record<string, unknown>;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  full_name: string;
  phone?: string;
  role_id?: string;
  avatar_url?: string;
  is_active: boolean;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  organization_id: string;
  role_name: string;
  permissions: Record<string, unknown>;
  is_system_role: boolean;
  created_at: string;
}

export interface Warehouse {
  id: string;
  organization_id: string;
  name: string;
  location?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  organization_id: string;
  warehouse_id: string;
  name: Record<string, string>;
  category?: string;
  sku?: string;
  barcode?: string;
  product_type: 'physical' | 'service' | 'digital' | 'raw';
  unit_type: string;
  image_url?: string;
  retail_price: number;
  wholesale_price?: number;
  wholesale_min_qty: number;
  cost_price?: number;
  current_stock: number;
  reorder_level: number;
  tax_rate: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  organization_id: string;
  item_id: string;
  source_warehouse_id?: string;
  dest_warehouse_id?: string;
  quantity: number;
  type: 'in' | 'out' | 'transfer' | 'sale' | 'adjustment';
  reference_note?: string;
  attachment_url?: string;
  performed_by?: string;
  movement_date: string;
  created_at: string;
}

export interface MoneyVault {
  id: string;
  organization_id: string;
  name: string;
  currency_base: string;
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VaultSession {
  id: string;
  organization_id: string;
  vault_id: string;
  opened_by: string;
  closed_by?: string;
  opening_balance: number;
  closing_balance?: number;
  physical_count?: number;
  variance?: number;
  status: 'open' | 'closed';
  notes?: string;
  opened_at: string;
  closed_at?: string;
}

export interface Transaction {
  id: string;
  organization_id: string;
  vault_session_id: string;
  vault_id: string;
  amount: number;
  currency: string;
  exchange_rate: number;
  amount_in_base: number;
  type: 'credit' | 'debit';
  category: string;
  description?: string;
  attachment_url?: string;
  sale_id?: string;
  expense_id?: string;
  performed_by: string;
  recorded_at: string;
}

export interface Sale {
  id: string;
  organization_id: string;
  cashier_id: string;
  vault_id: string;
  warehouse_id: string;
  subtotal: number;
  discount: number;
  tax_total: number;
  total_amount: number;
  payment_method: string;
  payment_details?: Record<string, unknown>;
  receipt_data?: Record<string, unknown>;
  notes?: string;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  price_type: 'retail' | 'wholesale';
  discount: number;
  line_total: number;
  created_at: string;
}

export interface Employee {
  id: string;
  organization_id: string;
  dynamic_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  address?: string;
  photo_url?: string;
  job_title?: string;
  department?: string;
  salary_base: number;
  hire_date?: string;
  status: 'active' | 'on_leave' | 'terminated';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialAdvance {
  id: string;
  organization_id: string;
  employee_id: string;
  amount: number;
  reason?: string;
  payout_type: 'cash_out' | 'salary_deduction';
  installments: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approved_by?: string;
  transaction_id?: string;
  requested_at: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  organization_id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  exchange_rate: number;
  amount_in_base: number;
  vault_id?: string;
  paid_by?: string;
  receipt_url?: string;
  notes?: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export interface CurrencyRate {
  id: string;
  currency_code: string;
  rate_to_base: number;
  source: string;
  rate_date: string;
  created_at: string;
}

export interface SystemLog {
  id: string;
  organization_id?: string;
  performed_by?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  logged_at: string;
}
