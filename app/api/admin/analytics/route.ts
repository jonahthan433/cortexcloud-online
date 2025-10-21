import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalUsers,
      recentSignups,
      subscriptionBreakdown,
      monthlyGrowth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.user.groupBy({
        by: ['subscription_tier'],
        _count: true
      }),
      prisma.user.groupBy({
        by: ['created_at'],
        _count: true,
        where: {
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      })
    ]);

    return NextResponse.json({
      totalUsers,
      recentSignups,
      subscriptionBreakdown,
      monthlyGrowth
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
