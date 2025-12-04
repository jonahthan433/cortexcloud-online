import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        subscription_tier: true,
        created_at: true,
        trial_started: true,
        trial_expires_at: true,
        role: true,
      },
    });

    // Convert to CSV
    const csv = [
      'ID,Email,Name,Company,Subscription Tier,Created At,Trial Started,Trial Expires,Role',
      ...users.map(user => 
        `${user.id},${user.email},${user.name},${user.company || ''},${user.subscription_tier},${user.created_at},${user.trial_started},${user.trial_expires_at || ''},${user.role}`
      )
    ].join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="users.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting users:', error);
    return NextResponse.json(
      { error: 'Failed to export users' },
      { status: 500 }
    );
  }
}
