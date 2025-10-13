'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewWorkflowPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspace_id: '', // This should be fetched from context/state
  });
  const [aiPrompt, setAiPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, we'll use a default workspace - in production, fetch from user's workspaces
      const workspaceId = 'default-workspace-id';

      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          workspace_id: workspaceId,
          steps: [],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create workflow');
      }

      const { workflow } = await response.json();
      toast.success('Workflow created successfully');
      router.push(`/dashboard/workflows/${workflow.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create workflow');
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe what you want to automate');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: aiPrompt }),
      });

      if (!response.ok) throw new Error('Failed to generate workflow');

      const { workflow } = await response.json();
      setFormData({
        name: workflow.name,
        description: aiPrompt,
        workspace_id: formData.workspace_id,
      });
      toast.success('Workflow suggestion generated!');
    } catch (error) {
      toast.error('AI generation is not configured yet');
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    {
      name: 'Lead Nurturing Campaign',
      description: 'Automatically follow up with new leads via email',
      steps: 5,
    },
    {
      name: 'Invoice Processing',
      description: 'Extract data from invoices and update records',
      steps: 4,
    },
    {
      name: 'Customer Onboarding',
      description: 'Welcome new customers with automated tasks',
      steps: 6,
    },
    {
      name: 'Data Sync',
      description: 'Sync data between multiple platforms',
      steps: 3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/workflows">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Workflow</h1>
          <p className="text-muted-foreground">
            Build a new automation from scratch or use a template
          </p>
        </div>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Details</CardTitle>
              <CardDescription>
                Start by giving your workflow a name and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workflow Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Customer Onboarding Flow"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this workflow does..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Workflow'}
                  </Button>
                  <Link href="/dashboard/workflows">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                AI Workflow Generator
              </CardTitle>
              <CardDescription>
                Describe what you want to automate and AI will create a workflow for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">What do you want to automate?</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="e.g., When a new customer signs up, send them a welcome email and create a task in my project management tool"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={6}
                />
              </div>

              <Button onClick={handleAIGenerate} disabled={loading}>
                <Wand2 className="mr-2 h-4 w-4" />
                {loading ? 'Generating...' : 'Generate Workflow'}
              </Button>

              {formData.name && (
                <Card className="mt-6 bg-muted">
                  <CardHeader>
                    <CardTitle className="text-base">Generated Workflow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label>Name</Label>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.description}
                      </p>
                    </div>
                    <Button onClick={handleSubmit} disabled={loading} className="mt-4">
                      Create This Workflow
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card key={template.name} className="cursor-pointer hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {template.steps} steps • Beginner friendly
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setFormData({
                        name: template.name,
                        description: template.description,
                        workspace_id: formData.workspace_id,
                      });
                      toast.success('Template loaded! Review and create.');
                    }}
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


