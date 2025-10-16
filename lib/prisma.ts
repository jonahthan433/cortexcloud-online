import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Utility functions for common operations

export async function createUser(data: {
  email: string;
  name?: string;
  company?: string;
  password_hash?: string;
}) {
  return prisma.user.create({
    data: {
      ...data,
      subscription_tier: 'TRIAL',
      trial_started: false,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        orderBy: { created_at: 'desc' },
        take: 1,
      },
      usageRecords: {
        orderBy: { created_at: 'desc' },
        take: 1,
      },
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        orderBy: { created_at: 'desc' },
        take: 1,
      },
      usageRecords: {
        orderBy: { created_at: 'desc' },
        take: 1,
      },
    },
  });
}

export async function updateUserSubscription(
  userId: string,
  subscriptionTier: 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE'
) {
  return prisma.user.update({
    where: { id: userId },
    data: { subscription_tier: subscriptionTier },
  });
}

export async function startTrial(userId: string) {
  const trialExpiry = new Date();
  trialExpiry.setDate(trialExpiry.getDate() + 14); // 14-day trial

  return prisma.user.update({
    where: { id: userId },
    data: {
      trial_started: true,
      trial_expires_at: trialExpiry,
      subscription_tier: 'TRIAL',
    },
  });
}

export async function trackUsage(
  userId: string,
  type: 'workflow_runs' | 'documents_processed' | 'api_calls'
) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const usage = await prisma.usage.findFirst({
    where: {
      user_id: userId,
      period_start: { lte: now },
      period_end: { gte: now },
    },
  });

  if (usage) {
    return prisma.usage.update({
      where: { id: usage.id },
      data: {
        [type]: { increment: 1 },
      },
    });
  } else {
    return prisma.usage.create({
      data: {
        user_id: userId,
        [type]: 1,
        period_start: startOfMonth,
        period_end: endOfMonth,
      },
    });
  }
}

export async function createAuditLog(data: {
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
}) {
  return prisma.auditLog.create({
    data,
  });
}

export default prisma;


