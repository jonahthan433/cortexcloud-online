import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  Calendar,
  MessageSquare,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePlan } from '@/contexts/PlanContext';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logUserAction, logBusinessEvent } from '@/utils/logger';
import { LoadingSpinner, InlineLoading } from '@/components/LoadingStates';

interface DashboardMetrics {
  totalLeads: number;
  activeCampaigns: number;
  revenue: number;
  conversionRate: number;
  monthlyGrowth: number;
  weeklyGrowth: number;
  dailyGrowth: number;
}

interface ChartData {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
}

interface RealTimeData {
  timestamp: string;
  leads: number;
  revenue: number;
  conversions: number;
}

export const EnhancedDashboard: React.FC = () => {
  const { currentPlan, hasFeature } = usePlan();
  const { measureInteraction } = usePerformanceMonitor('EnhancedDashboard');
  
  // State management
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['leads', 'revenue', 'conversions']);
  const [showRealTime, setShowRealTime] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in production, this would come from your API
  const mockMetrics: DashboardMetrics = {
    totalLeads: 1247,
    activeCampaigns: 8,
    revenue: 45680,
    conversionRate: 12.4,
    monthlyGrowth: 15.2,
    weeklyGrowth: 8.7,
    dailyGrowth: 3.2
  };

  const mockChartData: ChartData[] = [
    { name: 'Mon', value: 45, previousValue: 38, change: 18.4 },
    { name: 'Tue', value: 52, previousValue: 42, change: 23.8 },
    { name: 'Wed', value: 48, previousValue: 45, change: 6.7 },
    { name: 'Thu', value: 61, previousValue: 52, change: 17.3 },
    { name: 'Fri', value: 55, previousValue: 48, change: 14.6 },
    { name: 'Sat', value: 42, previousValue: 38, change: 10.5 },
    { name: 'Sun', value: 38, previousValue: 35, change: 8.6 }
  ];

  const mockRealTimeData: RealTimeData[] = [
    { timestamp: '10:00', leads: 12, revenue: 2400, conversions: 3 },
    { timestamp: '10:15', leads: 18, revenue: 3600, conversions: 5 },
    { timestamp: '10:30', leads: 15, revenue: 3000, conversions: 4 },
    { timestamp: '10:45', leads: 22, revenue: 4400, conversions: 6 },
    { timestamp: '11:00', leads: 19, revenue: 3800, conversions: 5 }
  ];

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMetrics(mockMetrics);
        setChartData(mockChartData);
        setRealTimeData(mockRealTimeData);
        
        logBusinessEvent('dashboard_loaded', {
          plan: currentPlan,
          dateRange,
          metrics: Object.keys(mockMetrics)
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [dateRange, currentPlan]);

  // Real-time updates simulation
  useEffect(() => {
    if (!showRealTime) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newData = [...prev];
        const lastEntry = newData[newData.length - 1];
        const newEntry: RealTimeData = {
          timestamp: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          leads: lastEntry.leads + Math.floor(Math.random() * 5),
          revenue: lastEntry.revenue + Math.floor(Math.random() * 1000),
          conversions: lastEntry.conversions + Math.floor(Math.random() * 2)
        };
        
        // Keep only last 10 entries
        if (newData.length >= 10) {
          newData.shift();
        }
        newData.push(newEntry);
        
        return newData;
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [showRealTime]);

  // Filtered and processed data
  const filteredChartData = useMemo(() => {
    return chartData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chartData, searchTerm]);

  const handleRefresh = () => {
    measureInteraction('refresh', () => {
      setRefreshing(true);
      logUserAction('dashboard_refresh', { dateRange });
      
      // Simulate refresh
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    });
  };

  const handleExport = () => {
    measureInteraction('export', () => {
      logUserAction('dashboard_export', { 
        dateRange, 
        metrics: selectedMetrics,
        format: 'csv'
      });
      
      // Simulate export
      const csvContent = [
        ['Date', 'Leads', 'Revenue', 'Conversions'],
        ...realTimeData.map(item => [
          item.timestamp,
          item.leads.toString(),
          item.revenue.toString(),
          item.conversions.toString()
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-export-${dateRange}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (value: number) => {
    return value > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return <InlineLoading message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights for your business growth
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{metrics?.totalLeads.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(mockMetrics.monthlyGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(mockMetrics.monthlyGrowth)}`}>
                    {formatPercentage(mockMetrics.monthlyGrowth)} from last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics?.revenue || 0)}</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(mockMetrics.weeklyGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(mockMetrics.weeklyGrowth)}`}>
                    {formatPercentage(mockMetrics.weeklyGrowth)} from last week
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{metrics?.conversionRate.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(mockMetrics.dailyGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(mockMetrics.dailyGrowth)}`}>
                    {formatPercentage(mockMetrics.dailyGrowth)} from yesterday
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{metrics?.activeCampaigns}</p>
                <div className="flex items-center mt-1">
                  <Badge variant="secondary" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    Running
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-full">
                <Zap className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="glass-effect border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Performance Trends</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRealTime(!showRealTime)}
                >
                  {showRealTime ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="previousValue" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card className="glass-effect border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Real-time Activity</span>
              <Badge variant={showRealTime ? "default" : "secondary"}>
                {showRealTime ? "Live" : "Paused"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="conversions" 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      {hasFeature('advanced-analytics') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Direct', value: 45, color: '#8884d8' },
                      { name: 'Referral', value: 30, color: '#82ca9d' },
                      { name: 'Social', value: 15, color: '#ffc658' },
                      { name: 'Email', value: 10, color: '#ff7300' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Direct', value: 45, color: '#8884d8' },
                      { name: 'Referral', value: 30, color: '#82ca9d' },
                      { name: 'Social', value: 15, color: '#ffc658' },
                      { name: 'Email', value: 10, color: '#ff7300' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-effect border-primary/20 lg:col-span-2">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                  <Bar dataKey="previousValue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Data Explorer</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredChartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Current: {item.value} | Previous: {item.previousValue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.value}</p>
                  <p className={`text-sm ${getGrowthColor(item.change || 0)}`}>
                    {formatPercentage(item.change || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
