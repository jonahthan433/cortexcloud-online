import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, trackUsage, createAuditLog } from '@/lib/prisma';
import { checkSubscriptionLimit } from '@/lib/rbac';
import { sendWorkflowNotification } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get workflow and check ownership
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        user_id: session.user.id,
      },
      include: {
        workflowSteps: {
          orderBy: { position: 'asc' },
        },
        user: true,
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Check if workflow is active
    if (!workflow.is_active) {
      return NextResponse.json(
        { error: 'Workflow is not active' },
        { status: 400 }
      );
    }

    // Check usage limits
    const currentMonth = new Date();
    const usage = await prisma.usage.findFirst({
      where: {
        user_id: session.user.id,
        period_start: {
          lte: currentMonth,
        },
        period_end: {
          gte: currentMonth,
        },
      },
    });

    const limitCheck = checkSubscriptionLimit(
      workflow.user.subscription_tier as any,
      'workflow_runs',
      usage?.workflow_runs || 0
    );

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'Workflow run limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Create workflow run record
    const workflowRun = await prisma.workflowRun.create({
      data: {
        workflow_id: workflow.id,
        status: 'RUNNING',
        logs: {
          started_at: new Date().toISOString(),
        },
      },
    });

    // Execute workflow (simplified version - in production, use a queue system)
    try {
      const steps = Array.isArray(workflow.steps) ? workflow.steps : [];
      const results = [];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        // Simulate step execution
        results.push({
          step: i + 1,
          type: step.type || 'action',
          status: 'success',
          output: `Step ${i + 1} executed successfully`,
        });
      }

      // Update run status
      await prisma.workflowRun.update({
        where: { id: workflowRun.id },
        data: {
          status: 'SUCCESS',
          completed_at: new Date(),
          result: results,
          logs: {
            started_at: workflowRun.logs.started_at,
            completed_at: new Date().toISOString(),
            steps: results,
          },
        },
      });

      // Update automation stats
      await prisma.automation.update({
        where: { workflow_id: workflow.id },
        data: {
          run_count: { increment: 1 },
          last_run: new Date(),
          success_rate: {
            increment: 1,
          },
        },
      });

      // Track usage
      await trackUsage(session.user.id, 'workflow_runs');

      // Send notification
      sendWorkflowNotification(
        workflow.user.email,
        workflow.name,
        'success'
      ).catch(console.error);

      // Audit log
      await createAuditLog({
        user_id: session.user.id,
        action: 'workflow.executed',
        entity_type: 'workflow',
        entity_id: workflow.id,
        metadata: { name: workflow.name, status: 'success' },
        ip_address: request.headers.get('x-forwarded-for') || undefined,
        user_agent: request.headers.get('user-agent') || undefined,
      });

      return NextResponse.json({
        success: true,
        run_id: workflowRun.id,
        status: 'SUCCESS',
        results,
      });
    } catch (error: any) {
      // Update run status to failed
      await prisma.workflowRun.update({
        where: { id: workflowRun.id },
        data: {
          status: 'FAILED',
          completed_at: new Date(),
          error: error.message,
        },
      });

      // Send failure notification
      sendWorkflowNotification(
        workflow.user.email,
        workflow.name,
        'failed',
        error.message
      ).catch(console.error);

      return NextResponse.json(
        {
          success: false,
          run_id: workflowRun.id,
          error: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error running workflow:', error);
    return NextResponse.json(
      { error: 'Failed to run workflow' },
      { status: 500 }
    );
  }
}


