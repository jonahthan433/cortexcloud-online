// Role-Based Access Control (RBAC) utilities

export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type Permission =
  | 'read:own_data'
  | 'write:own_data'
  | 'delete:own_data'
  | 'read:workspace'
  | 'write:workspace'
  | 'delete:workspace'
  | 'manage:team'
  | 'read:analytics'
  | 'manage:billing'
  | 'read:all_users'
  | 'write:all_users'
  | 'delete:all_users'
  | 'manage:system';

const rolePermissions: Record<Role, Permission[]> = {
  USER: [
    'read:own_data',
    'write:own_data',
    'delete:own_data',
    'read:workspace',
    'write:workspace',
    'read:analytics',
    'manage:billing',
  ],
  ADMIN: [
    'read:own_data',
    'write:own_data',
    'delete:own_data',
    'read:workspace',
    'write:workspace',
    'delete:workspace',
    'manage:team',
    'read:analytics',
    'manage:billing',
    'read:all_users',
    'write:all_users',
  ],
  SUPER_ADMIN: [
    'read:own_data',
    'write:own_data',
    'delete:own_data',
    'read:workspace',
    'write:workspace',
    'delete:workspace',
    'manage:team',
    'read:analytics',
    'manage:billing',
    'read:all_users',
    'write:all_users',
    'delete:all_users',
    'manage:system',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

export function canAccessResource(
  userRole: Role,
  resourceOwnerId: string,
  currentUserId: string,
  requiredPermission: Permission
): boolean {
  // Owners can always access their own resources
  if (resourceOwnerId === currentUserId) {
    return true;
  }

  // Check if user has the required permission for others' resources
  return hasPermission(userRole, requiredPermission);
}

// Subscription tier limits
export const SUBSCRIPTION_LIMITS = {
  TRIAL: {
    workflow_runs: 100,
    documents: 10,
    users: 1,
    api_calls: 1000,
    integrations: 2,
  },
  STARTER: {
    workflow_runs: 100,
    documents: 10,
    users: 1,
    api_calls: 1000,
    integrations: 3,
  },
  PROFESSIONAL: {
    workflow_runs: 5000,
    documents: 500,
    users: 5,
    api_calls: 50000,
    integrations: 10,
  },
  BUSINESS: {
    workflow_runs: 25000,
    documents: -1, // unlimited
    users: 20,
    api_calls: 250000,
    integrations: -1, // unlimited
  },
  ENTERPRISE: {
    workflow_runs: -1, // unlimited
    documents: -1, // unlimited
    users: -1, // unlimited
    api_calls: -1, // unlimited
    integrations: -1, // unlimited
  },
};

export function checkSubscriptionLimit(
  tier: keyof typeof SUBSCRIPTION_LIMITS,
  resource: keyof typeof SUBSCRIPTION_LIMITS.TRIAL,
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number } {
  const limit = SUBSCRIPTION_LIMITS[tier][resource];
  
  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }

  const allowed = currentUsage < limit;
  const remaining = Math.max(0, limit - currentUsage);

  return { allowed, limit, remaining };
}


