'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Target,
  RefreshCw,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function AnalyticsPage() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      progress: 75
    },
    {
      title: 'New Leads',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      progress: 62
    },
    {
      title: 'Conversion Rate',
      value: '32%',
      change: '+4.3%',
      trend: 'up',
      progress: 86
    },
    {
      title: 'Active Users',
      value: '573',
      change: '-2.4%',
      trend: 'down',
      progress: 45
    }
  ];

  const revenueData = [
    { date: 'Jan', amount: 4000 },
    { date: 'Feb', amount: 3000 },
    { date: 'Mar', amount: 5000 },
    { date: 'Apr', amount: 4500 },
    { date: 'May', amount: 6000 },
    { date: 'Jun', amount: 5500 }
  ];

  const leadSources = [
    { source: 'Website', percentage: 45 },
    { source: 'Social Media', percentage: 30 },
    { source: 'Referrals', percentage: 15 },
    { source: 'Email', percentage: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your business performance and metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                <div className={`flex items-center space-x-1 ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-xs">{metric.change}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{metric.value}</p>
                <Progress value={metric.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Revenue Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Lead Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadSources} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis type="number" />
                  <YAxis dataKey="source" type="category" width={100} />
                  <Tooltip />
                  <Bar 
                    dataKey="percentage" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Recent Leads</span>
            </CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'John Smith', email: 'john@example.com', value: '$2,500', source: 'Website', status: 'New' },
              { name: 'Sarah Johnson', email: 'sarah@company.com', value: '$1,800', source: 'Social Media', status: 'Qualified' },
              { name: 'Mike Davis', email: 'mike@business.com', value: '$3,200', source: 'Referral', status: 'Contacted' },
            ].map((lead, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{lead.value}</p>
                  <p className="text-xs text-muted-foreground">{lead.source}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs ${
                  lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                  lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


