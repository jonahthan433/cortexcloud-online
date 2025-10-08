import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Calendar,
  DollarSign,
  Target,
  Zap,
  RefreshCw
} from "lucide-react";
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
} from "recharts";
import { dashboardService } from "@/services/dashboardService";
import type { DashboardMetric, RevenueData, LeadSource, Lead } from "@/services/dashboardService";

export const OverviewTab = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { 
    data: metrics, 
    refetch: refetchMetrics,
    isLoading: isLoadingMetrics 
  } = useQuery<DashboardMetric[]>({
    queryKey: ['dashboardMetrics'],
    queryFn: () => dashboardService.getMetrics()
  });

  const { 
    data: revenueData,
    refetch: refetchRevenue,
    isLoading: isLoadingRevenue
  } = useQuery<RevenueData[]>({
    queryKey: ['revenueData'],
    queryFn: () => dashboardService.getRevenueData()
  });

  const {
    data: leadSources,
    refetch: refetchLeadSources,
    isLoading: isLoadingLeadSources
  } = useQuery<LeadSource[]>({
    queryKey: ['leadSources'],
    queryFn: () => dashboardService.getLeadSources()
  });

  const {
    data: recentLeads,
    refetch: refetchLeads,
    isLoading: isLoadingLeads
  } = useQuery<Lead[]>({
    queryKey: ['recentLeads'],
    queryFn: () => dashboardService.getRecentLeads()
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchMetrics(),
      refetchRevenue(),
      refetchLeadSources(),
      refetchLeads()
    ]);
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Your dashboard data has been updated.",
    });
  };

  const handleViewAllLeads = () => {
    toast({
      title: "Navigating to CRM",
      description: "Opening full contact list...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Key Performance Metrics</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingMetrics ? Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="glass-effect border-primary/20">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-primary/10 rounded w-2/3"></div>
                <div className="h-6 bg-primary/10 rounded w-1/2"></div>
                <div className="h-2 bg-primary/10 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        )) : metrics ? metrics.map((metric, index) => (
          <Card key={index} className="glass-effect border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
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
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <Progress value={metric.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="glass-effect border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Revenue Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? (
              <div className="h-64 flex items-center justify-center">
                <span className="loading">Loading revenue data...</span>
              </div>
            ) : revenueData && revenueData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--primary)" opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--muted-foreground)"
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short' })}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)"
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)'
                      }}
                      labelStyle={{ color: 'var(--foreground)' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="var(--primary)" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p>No revenue data available</p>
                  <p className="text-sm">Try refreshing the dashboard</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="glass-effect border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Lead Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLeadSources ? (
              <div className="h-48 flex items-center justify-center">
                <span className="loading">Loading lead sources...</span>
              </div>
            ) : leadSources && leadSources.length > 0 ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadSources} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--primary)" opacity={0.1} />
                    <XAxis 
                      type="number" 
                      stroke="var(--muted-foreground)"
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis 
                      dataKey="source" 
                      type="category" 
                      stroke="var(--muted-foreground)" 
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)'
                      }}
                      labelStyle={{ color: 'var(--foreground)' }}
                      formatter={(value: number) => [`${value}%`, 'Percentage']}
                    />
                    <Bar 
                      dataKey="percentage" 
                      fill="var(--primary)" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p>No lead source data available</p>
                  <p className="text-sm">Try refreshing the dashboard</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Recent Leads</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleViewAllLeads}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingLeads ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-primary/10 rounded w-32 animate-pulse" />
                      <div className="h-3 bg-primary/10 rounded w-48 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-primary/10 rounded w-16 animate-pulse" />
                    <div className="h-6 bg-primary/10 rounded w-20 animate-pulse" />
                  </div>
                </div>
              ))
            ) : !recentLeads ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent leads available</p>
              </div>
            ) : (
              recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{lead.value}</p>
                    <p className="text-xs text-muted-foreground">{lead.source}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

