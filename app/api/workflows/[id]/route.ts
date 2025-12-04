import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma, createAuditLog } from '@/lib/prisma';
import { z } from 'zod';

const updateWorkflowSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  steps: z.array(z.any()).optional(),
  triggers: z.any().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
  is_active: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        user_id: session.user.id,
      },
      include: {
        automation: true,
        workflowSteps: {
          orderBy: { position: 'asc' },
        },
        runs: {
          orderBy: { started_at: 'desc' },
          take: 10,
        },
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    return NextResponse.json({ workflow });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = updateWorkflowSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    // Check ownership
    const existingWorkflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        user_id: session.user.id,
      },
    });

    if (!existingWorkflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Update workflow
    const workflow = await prisma.workflow.update({
      where: { id: params.id },
      data: validationResult.data,
      include: {
        automation: true,
      },
    });

    // Audit log
    await createAuditLog({
      user_id: session.user.id,
      action: 'workflow.updated',
      entity_type: 'workflow',
      entity_id: workflow.id,
      metadata: validationResult.data,
      ip_address: request.headers.get('x-forwarded-for') || undefined,
      user_agent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ workflow });
  } catch (error) {
    console.error('Error updating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check ownership
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        user_id: session.user.id,
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Delete workflow (cascades to automation and runs)
    await prisma.workflow.delete({
      where: { id: params.id },
    });

    // Audit log
    await createAuditLog({
      user_id: session.user.id,
      action: 'workflow.deleted',
      entity_type: 'workflow',
      entity_id: params.id,
      metadata: { name: workflow.name },
      ip_address: request.headers.get('x-forwarded-for') || undefined,
      user_agent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    );
  }
}


