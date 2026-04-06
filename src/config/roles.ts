export type RoleName = 'owner' | 'admin' | 'accountant' | 'cashier' | 'warehouse' | 'viewer';

export interface Permission {
  module: string;
  actions: ('read' | 'write' | 'delete' | 'manage')[];
}

export const rolePermissions: Record<RoleName, Permission[]> = {
  owner: [
    { module: 'dashboard', actions: ['read', 'write', 'delete', 'manage'] },
    { module: 'pos', actions: ['read', 'write', 'delete', 'manage'] },
    { module: 'inventory', actions: ['read', 'write', 'delete', 'manage'] },
    { module: 'vault', actions: ['read', 'write', 'delete', 'manage'] },
    { module: 'employees', actions: ['read', 'write', 'delete', 'manage'] },
    { module: 'expenses', actions: ['read', 'write', 'delete', 'manage'] },
    { module: 'settings', actions: ['read', 'write', 'delete', 'manage'] },
  ],
  admin: [
    { module: 'dashboard', actions: ['read', 'write', 'delete'] },
    { module: 'pos', actions: ['read', 'write', 'delete'] },
    { module: 'inventory', actions: ['read', 'write', 'delete'] },
    { module: 'vault', actions: ['read', 'write', 'delete'] },
    { module: 'employees', actions: ['read', 'write', 'delete'] },
    { module: 'expenses', actions: ['read', 'write', 'delete'] },
    { module: 'settings', actions: ['read', 'write'] },
  ],
  accountant: [
    { module: 'dashboard', actions: ['read', 'write'] },
    { module: 'pos', actions: ['read'] },
    { module: 'inventory', actions: ['read'] },
    { module: 'vault', actions: ['read', 'write'] },
    { module: 'employees', actions: ['read'] },
    { module: 'expenses', actions: ['read', 'write'] },
    { module: 'settings', actions: ['read'] },
  ],
  cashier: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'pos', actions: ['read', 'write'] },
    { module: 'inventory', actions: ['read'] },
    { module: 'vault', actions: ['read', 'write'] },
    { module: 'employees', actions: [] },
    { module: 'expenses', actions: [] },
    { module: 'settings', actions: [] },
  ],
  warehouse: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'pos', actions: [] },
    { module: 'inventory', actions: ['read', 'write'] },
    { module: 'vault', actions: [] },
    { module: 'employees', actions: [] },
    { module: 'expenses', actions: [] },
    { module: 'settings', actions: [] },
  ],
  viewer: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'pos', actions: ['read'] },
    { module: 'inventory', actions: ['read'] },
    { module: 'vault', actions: ['read'] },
    { module: 'employees', actions: ['read'] },
    { module: 'expenses', actions: ['read'] },
    { module: 'settings', actions: [] },
  ],
};

export function hasPermission(role: RoleName, module: string, action: 'read' | 'write' | 'delete' | 'manage'): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  
  const modulePerms = permissions.find(p => p.module === module);
  if (!modulePerms) return false;
  
  return modulePerms.actions.includes(action) || modulePerms.actions.includes('manage');
}
