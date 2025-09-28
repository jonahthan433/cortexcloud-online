import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
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

export const OverviewTab = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
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
  const metrics = [
    {
      title: "Lead Conversion Rate",
      value: "24.5%",
      change: "+3.2%",
      trend: "up",
      progress: 75
    },
    {
      title: "Email Open Rate",
      value: "68.2%",
      change: "+5.1%",
      trend: "up",
      progress: 68
    },
    {
      title: "Automation Completion",
      value: "89.3%",
      change: "+2.8%",
      trend: "up",
      progress: 89
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      trend: "up",
      progress: 96
    }
  ];

  const recentLeads = [
    { name: "John Smith", email: "john@example.com", source: "Website", status: "New", value: "$2,500" },
    { name: "Sarah Johnson", email: "sarah@company.com", source: "Social Media", status: "Qualified", value: "$1,800" },
    { name: "Mike Davis", email: "mike@business.com", source: "Referral", status: "Contacted", value: "$3,200" },
    { name: "Lisa Wilson", email: "lisa@startup.com", source: "Email Campaign", status: "New", value: "$1,200" }
  ];

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
        {metrics.map((metric, index) => (
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
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p>Revenue chart will be displayed here</p>
                <p className="text-sm">Integration with analytics coming soon</p>
              </div>
            </div>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Website</span>
                <div className="flex items-center space-x-2">
                  <Progress value={45} className="w-20 h-2" />
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Social Media</span>
                <div className="flex items-center space-x-2">
                  <Progress value={30} className="w-20 h-2" />
                  <span className="text-sm font-medium">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Campaigns</span>
                <div className="flex items-center space-x-2">
                  <Progress value={15} className="w-20 h-2" />
                  <span className="text-sm font-medium">15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Referrals</span>
                <div className="flex items-center space-x-2">
                  <Progress value={10} className="w-20 h-2" />
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
            </div>
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
            {recentLeads.map((lead, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

