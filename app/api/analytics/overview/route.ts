import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch workflow statistics
    const workflows = await prisma.workflow.findMany({
      where: {
        user_id: session.user.id,
        created_at: { gte: startDate },
      },
      include: {
        runs: {
          where: {
            started_at: { gte: startDate },
          },
        },
        automation: true,
      },
    });

    // Fetch document statistics
    const documents = await prisma.document.findMany({
      where: {
        user_id: session.user.id,
        created_at: { gte: startDate },
      },
    });

    // Fetch usage statistics
    const usage = await prisma.usage.findMany({
      where: {
        user_id: session.user.id,
        period_start: { gte: startDate },
      },
      orderBy: {
        period_start: 'asc',
      },
    });

    // Calculate metrics
    const totalRuns = workflows.reduce((sum, w) => sum + w.runs.length, 0);
    const successfulRuns = workflows.reduce(
      (sum, w) => sum + w.runs.filter((r) => r.status === 'SUCCESS').length,
      0
    );
    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    const metrics = {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter((w) => w.is_active).length,
      totalRuns,
      successRate: Math.round(successRate),
      documentsProcessed: documents.length,
      completedDocuments: documents.filter((d) => d.status === 'COMPLETED').length,
    };

    // Prepare time series data
    const timeSeriesData = usage.map((u) => ({
      date: u.period_start.toISOString(),
      workflow_runs: u.workflow_runs,
      documents_processed: u.documents_processed,
      api_calls: u.api_calls,
    }));

    return NextResponse.json({
      metrics,
      timeSeriesData,
      workflows: workflows.map((w) => ({
        id: w.id,
        name: w.name,
        runs: w.runs.length,
        success_rate: w.automation?.success_rate || 0,
      })),
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}


