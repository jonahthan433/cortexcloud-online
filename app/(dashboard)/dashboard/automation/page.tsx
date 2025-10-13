'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Users, 
  Mail, 
  MessageSquare,
  Calendar,
  TrendingUp,
  Clock,
  Bot,
  Brain
} from 'lucide-react';

export default function AutomationPage() {
  const initialAutomations = [
    {
      id: 1,
      name: 'Welcome Email Sequence',
      type: 'Email',
      status: 'Active',
      contacts: 156,
      completion: 89,
      lastRun: '2 hours ago',
      description: 'Automatically sends welcome emails to new subscribers'
    },
    {
      id: 2,
      name: 'Lead Nurturing Campaign',
      type: 'Email',
      status: 'Active',
      contacts: 89,
      completion: 67,
      lastRun: '1 day ago',
      description: 'Follow-up sequence for qualified leads'
    },
    {
      id: 3,
      name: 'WhatsApp Follow-up',
      type: 'WhatsApp',
      status: 'Paused',
      contacts: 45,
      completion: 23,
      lastRun: '3 days ago',
      description: 'Automated WhatsApp messages for appointment reminders'
    },
    {
      id: 4,
      name: 'Social Media Scheduler',
      type: 'Social',
      status: 'Active',
      contacts: 234,
      completion: 95,
      lastRun: '30 minutes ago',
      description: 'Automatically posts content across social platforms'
    }
  ];

  const [automations, setAutomations] = useState(initialAutomations);

  const handleCreateAutomation = () => {
    toast.success('Opening automation builder...');
  };

  const handleToggleAutomation = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    setAutomations(prev => prev.map(auto => 
      auto.id === id ? { ...auto, status: newStatus } : auto
    ));
    toast.success(`Automation ${newStatus.toLowerCase()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return <Mail className="h-4 w-4" />;
      case 'WhatsApp':
        return <MessageSquare className="h-4 w-4" />;
      case 'Social':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation Builder</h1>
          <p className="text-muted-foreground">Create and manage your automated workflows</p>
        </div>
        <Link href="/dashboard/workflows/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Automation
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">12</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">3</div>
            <div className="text-sm text-muted-foreground">Paused</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">524</div>
            <div className="text-sm text-muted-foreground">Total Contacts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">78%</div>
            <div className="text-sm text-muted-foreground">Avg. Completion</div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Automations */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI-Powered Automations</span>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Bot className="mr-1 h-3 w-3" />
              AI Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center space-x-3">
                  <Bot className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-medium">Smart Lead Scoring</h4>
                    <p className="text-xs text-muted-foreground">AI rates potential customers</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-500">94%</div>
                <div className="text-xs text-muted-foreground">Accuracy Rate</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center space-x-3">
                  <Brain className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-medium">Content Optimization</h4>
                    <p className="text-xs text-muted-foreground">AI improves messaging</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-500">+34%</div>
                <div className="text-xs text-muted-foreground">Response Rate</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-medium">Predictive Analytics</h4>
                    <p className="text-xs text-muted-foreground">Forecast customer behavior</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-500">87%</div>
                <div className="text-xs text-muted-foreground">Prediction Accuracy</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Automation List */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <Card key={automation.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {getTypeIcon(automation.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{automation.name}</h3>
                    <p className="text-sm text-muted-foreground">{automation.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-xs text-muted-foreground">
                        <Users className="mr-1 inline h-3 w-3" />
                        {automation.contacts} contacts
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="mr-1 inline h-3 w-3" />
                        {automation.lastRun}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{automation.completion}%</div>
                    <div className="text-xs text-muted-foreground">Completion</div>
                  </div>
                  
                  <Badge className={getStatusColor(automation.status)}>
                    {automation.status}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={automation.status === 'Active'} 
                      onCheckedChange={() => handleToggleAutomation(automation.id, automation.status)}
                    />
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleAutomation(automation.id, automation.status)}
                    >
                      {automation.status === 'Active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="flex h-20 flex-col items-center justify-center space-y-2">
              <Mail className="h-6 w-6" />
              <span>Email Automation</span>
            </Button>
            <Button variant="outline" className="flex h-20 flex-col items-center justify-center space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span>WhatsApp Flow</span>
            </Button>
            <Button variant="outline" className="flex h-20 flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Appointment Reminders</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


