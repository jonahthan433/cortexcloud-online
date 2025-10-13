'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreVertical,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  Activity,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows');
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      toast.error('Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
      toast.success('Workflow deleted successfully');
      fetchWorkflows();
    } catch (error) {
      toast.error('Failed to delete workflow');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/workflows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      });
      toast.success(`Workflow ${!isActive ? 'activated' : 'paused'}`);
      fetchWorkflows();
    } catch (error) {
      toast.error('Failed to update workflow');
    }
  };

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const templates = [
    {
      name: 'Lead Nurturing',
      description: 'Automatically follow up with new leads',
      icon: '📧',
    },
    {
      name: 'Invoice Processing',
      description: 'Extract data from invoices and update records',
      icon: '📄',
    },
    {
      name: 'Customer Onboarding',
      description: 'Welcome new customers with automated tasks',
      icon: '👋',
    },
    {
      name: 'Social Media Posting',
      description: 'Schedule and publish content automatically',
      icon: '📱',
    },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            Manage and monitor your automation workflows
          </p>
        </div>
        <Link href="/dashboard/workflows/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {workflows.length === 0 ? (
        <div className="space-y-8">
          {/* Empty State */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Activity className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No workflows yet</h3>
              <p className="mb-6 text-center text-muted-foreground">
                Get started by creating your first workflow or choosing from our templates
              </p>
              <Link href="/dashboard/workflows/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Workflow
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Templates */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Popular Templates</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {templates.map((template) => (
                <Card key={template.name} className="cursor-pointer hover:border-primary">
                  <CardHeader>
                    <div className="mb-2 text-3xl">{template.icon}</div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{workflow.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {workflow.description || 'No description'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/workflows/${workflow.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(workflow.id, workflow.is_active)}
                      >
                        {workflow.is_active ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(workflow.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={workflow.is_active ? 'default' : 'secondary'}>
                    {workflow.is_active ? 'Active' : 'Paused'}
                  </Badge>
                  <Badge variant="outline">{workflow.status}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Runs</span>
                    <span className="font-medium">
                      {workflow._count?.runs || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">
                      {workflow.automation?.success_rate || 0}%
                    </span>
                  </div>
                  {workflow.automation?.last_run && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">
                        Last run {new Date(workflow.automation.last_run).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <Link href={`/dashboard/workflows/${workflow.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


