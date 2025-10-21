import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, createAuditLog } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { z } from 'zod';

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
  team_id: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's teams
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        user_id: session.user.id,
      },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ teams: teamMembers.map((tm) => tm.team) });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = inviteMemberSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, role, team_id } = validationResult.data;

    // Check if user has permission to invite
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !hasPermission(user.role as any, 'manage:team')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check if user being invited exists
    let invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a placeholder
    if (!invitedUser) {
      invitedUser = await prisma.user.create({
        data: {
          email,
          subscription_tier: 'TRIAL',
        },
      });
    }

    // Create team member record
    const teamMember = await prisma.teamMember.create({
      data: {
        team_id,
        user_id: invitedUser.id,
        role,
      },
      include: {
        user: true,
      },
    });

    // TODO: Send invitation email
    // await sendTeamInvitation(email, user.name || 'Team', team.name, inviteUrl);

    // Audit log
    await createAuditLog({
      user_id: session.user.id,
      action: 'team.member_invited',
      entity_type: 'team',
      entity_id: team_id,
      metadata: { email, role },
      ip_address: request.headers.get('x-forwarded-for') || undefined,
      user_agent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ teamMember }, { status: 201 });
  } catch (error) {
    console.error('Error inviting team member:', error);
    return NextResponse.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    );
  }
}


