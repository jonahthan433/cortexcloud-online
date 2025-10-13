'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Workflow,
  FileText,
  TrendingUp,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Activity,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    workflows: 0,
    workflowRuns: 0,
    documents: 0,
    successRate: 0,
  });
  const [usage, setUsage] = useState({
    workflowRuns: 0,
    workflowRunsLimit: 100,
    documents: 0,
    documentsLimit: 10,
  });

  useEffect(() => {
    // Fetch stats and usage
    // This is placeholder data - replace with actual API calls
    setStats({
      workflows: 5,
      workflowRuns: 47,
      documents: 23,
      successRate: 94,
    });
    
    setUsage({
      workflowRuns: 47,
      workflowRunsLimit: 100,
      documents: 23,
      documentsLimit: 100,
    });
  }, []);

  const quickActions = [
    {
      title: 'Create Workflow',
      description: 'Build a new automation',
      href: '/dashboard/workflows/new',
      icon: Workflow,
    },
    {
      title: 'Upload Document',
      description: 'Process a new document',
      href: '/dashboard/documents',
      icon: FileText,
    },
    {
      title: 'View Analytics',
      description: 'Check your performance',
      href: '/dashboard/analytics',
      icon: TrendingUp,
    },
    {
      title: 'Invite Team',
      description: 'Add team members',
      href: '/dashboard/team',
      icon: Users,
    },
  ];

  const recentActivity = [
    { type: 'workflow', name: 'Customer Onboarding', status: 'completed', time: '5 min ago' },
    { type: 'document', name: 'Invoice_2024.pdf', status: 'processed', time: '12 min ago' },
    { type: 'workflow', name: 'Email Campaign', status: 'running', time: '30 min ago' },
    { type: 'document', name: 'Contract.docx', status: 'completed', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user?.name || 'there'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your automations today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workflows}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workflowRuns}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+7</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Meters */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Period</CardTitle>
          <CardDescription>
            Track your usage against plan limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Workflow Runs</span>
              <span className="font-medium">
                {usage.workflowRuns} / {usage.workflowRunsLimit}
              </span>
            </div>
            <Progress
              value={(usage.workflowRuns / usage.workflowRunsLimit) * 100}
              className="h-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Documents</span>
              <span className="font-medium">
                {usage.documents} / {usage.documentsLimit}
              </span>
            </div>
            <Progress
              value={(usage.documents / usage.documentsLimit) * 100}
              className="h-2"
            />
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/billing">
              Upgrade Plan <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto w-full justify-start gap-4 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    {activity.type === 'workflow' ? (
                      <Workflow className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.status} • {activity.time}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


