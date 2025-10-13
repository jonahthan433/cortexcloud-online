'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, Plus, CheckCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const connectedIntegrations = [
    {
      name: 'Google Calendar',
      description: 'Sync appointments and meetings',
      icon: '📅',
      status: 'Connected',
      category: 'Calendar'
    },
    {
      name: 'Stripe',
      description: 'Payment processing',
      icon: '💳',
      status: 'Connected',
      category: 'Payment'
    }
  ];

  const availableIntegrations = [
    {
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: '💬',
      category: 'Communication'
    },
    {
      name: 'Salesforce',
      description: 'CRM integration',
      icon: '☁️',
      category: 'CRM'
    },
    {
      name: 'Google Drive',
      description: 'Cloud storage and file management',
      icon: '📁',
      category: 'Storage'
    },
    {
      name: 'Mailchimp',
      description: 'Email marketing automation',
      icon: '📧',
      category: 'Marketing'
    },
    {
      name: 'Zoom',
      description: 'Video conferencing',
      icon: '🎥',
      category: 'Communication'
    },
    {
      name: 'HubSpot',
      description: 'Marketing and sales platform',
      icon: '🎯',
      category: 'CRM'
    }
  ];

  const handleConnect = (integrationName: string) => {
    toast.success(`Connecting to ${integrationName}...`);
  };

  const handleDisconnect = (integrationName: string) => {
    toast.success(`Disconnected from ${integrationName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Connect your favorite tools and services</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{connectedIntegrations.length}</div>
            <div className="text-sm text-muted-foreground">Connected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{availableIntegrations.length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">6</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Connected Integrations */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Connected Integrations</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connectedIntegrations.map((integration) => (
            <Card key={integration.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <CardDescription className="text-xs">{integration.category}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">{integration.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDisconnect(integration.name)}
                  >
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Available Integrations</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableIntegrations.map((integration) => (
            <Card key={integration.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <CardDescription className="text-xs">{integration.category}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">{integration.description}</p>
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleConnect(integration.name)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Integration</CardTitle>
          <CardDescription>Need a custom integration? Let us know!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            We can build custom integrations for your specific needs. Contact our team to discuss your requirements.
          </p>
          <Button variant="outline">
            Request Custom Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


