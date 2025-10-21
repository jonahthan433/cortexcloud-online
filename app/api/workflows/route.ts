import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, trackUsage, createAuditLog } from '@/lib/prisma';
import { checkSubscriptionLimit } from '@/lib/rbac';
import { z } from 'zod';

const createWorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  workspace_id: z.string().uuid(),
  steps: z.array(z.any()).default([]),
  triggers: z.any().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');

    const where: any = {
      user_id: session.user.id,
    };

    if (workspaceId) {
      where.workspace_id = workspaceId;
    }

    const workflows = await prisma.workflow.findMany({
      where,
      include: {
        automation: true,
        _count: {
          select: { runs: true },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({ workflows });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
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
    const validationResult = createWorkflowSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description, workspace_id, steps, triggers } = validationResult.data;

    // Get user to check subscription limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        workflows: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check workflow limit
    const limitCheck = checkSubscriptionLimit(
      user.subscription_tier as any,
      'workflow_runs',
      user.workflows.length
    );

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'Workflow limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Create workflow
    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        workspace_id,
        user_id: session.user.id,
        steps,
        triggers,
        status: 'DRAFT',
      },
      include: {
        automation: true,
      },
    });

    // Create automation record
    await prisma.automation.create({
      data: {
        workflow_id: workflow.id,
      },
    });

    // Audit log
    await createAuditLog({
      user_id: session.user.id,
      action: 'workflow.created',
      entity_type: 'workflow',
      entity_id: workflow.id,
      metadata: { name },
      ip_address: request.headers.get('x-forwarded-for') || undefined,
      user_agent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}


