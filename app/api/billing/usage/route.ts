import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_LIMITS } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get current period usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const usage = await prisma.usage.findFirst({
      where: {
        user_id: session.user.id,
        period_start: { lte: now },
        period_end: { gte: now },
      },
    });

    const limits = SUBSCRIPTION_LIMITS[user.subscription_tier as keyof typeof SUBSCRIPTION_LIMITS];

    return NextResponse.json({
      usage: usage || {
        workflow_runs: 0,
        documents_processed: 0,
        api_calls: 0,
      },
      limits,
      tier: user.subscription_tier,
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage' },
      { status: 500 }
    );
  }
}


