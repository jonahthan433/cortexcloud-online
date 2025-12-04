/**
 * Reusable API route helpers
 * Reduces code duplication and standardizes patterns
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AuthenticationError, AuthorizationError, handleError } from '@/lib/errors';

/**
 * Get authenticated session or throw error
 */
export async function requireAuth(request?: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new AuthenticationError('Authentication required');
  }
  
  return session;
}

/**
 * Require admin role
 */
export async function requireAdmin(request?: NextRequest) {
  const session = await requireAuth(request);
  
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    throw new AuthorizationError('Admin access required');
  }
  
  return session;
}

/**
 * Require specific role
 */
export async function requireRole(
  roles: string[],
  request?: NextRequest
) {
  const session = await requireAuth(request);
  
  if (!roles.includes(session.user.role)) {
    throw new AuthorizationError('Insufficient permissions');
  }
  
  return session;
}

/**
 * Wrap API route handler with authentication
 */
export function withAuth<T extends any[]>(
  handler: (session: Awaited<ReturnType<typeof requireAuth>>, ...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const session = await requireAuth();
      return await handler(session, ...args);
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Wrap API route handler with admin check
 */
export function withAdmin<T extends any[]>(
  handler: (session: Awaited<ReturnType<typeof requireAdmin>>, ...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const session = await requireAdmin();
      return await handler(session, ...args);
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Get IP address from request
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: NextRequest): string | undefined {
  return request.headers.get('user-agent') || undefined;
}

