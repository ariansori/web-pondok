export interface AdminUser {
  id: number;
  nama: string;
  email: string;
  role: 'superadmin' | 'admin';
  token?: string;
  email_verified?: boolean | number;
  two_factor_enabled?: boolean | number;
  aktif?: boolean | number;
  created_at?: string;
}

const AUTH_STORAGE_KEY = 'alfatich_admin_auth';

/**
 * Retrieve current authenticated admin user from localStorage (safe for SSR)
 */
export function getStoredAuth(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

/**
 * Persist authenticated admin session to localStorage
 */
export function setStoredAuth(user: AdminUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save auth session:', err);
  }
}

/**
 * Remove admin session from localStorage
 */
export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
}

/**
 * Check if the user has superadmin privileges
 */
export function isSuperAdmin(user?: AdminUser | null): boolean {
  if (!user) return false;
  return user.role === 'superadmin' || user.email === 'pondokputraaf@gmail.com';
}
