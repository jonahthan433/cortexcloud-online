import { prisma } from '@/lib/prisma';

export async function logAdminAction(
  adminId: string,
  action: string,
  targetUserId?: string,
  metadata?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        user_id: adminId,
        action: `admin.${action}`,
        entity_type: 'user',
        entity_id: targetUserId,
        metadata: {
          ...metadata,
          admin_action: true,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

export async function logUserAction(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata,
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log user action:', error);
  }
}
