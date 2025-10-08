import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Dashboard components
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { CRMTab } from "@/components/dashboard/CRMTab";
import { AutomationTab } from "@/components/dashboard/AutomationTab";
import { CommunicationsTab } from "@/components/dashboard/CommunicationsTab";
import { CalendarTab } from "@/components/dashboard/CalendarTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";
import { TrialStatusBanner } from "@/components/dashboard/TrialStatusBanner";

// Plan-specific dashboards
import { PlanSelector } from "@/components/dashboard/PlanSelector";
import { InitiateDashboard } from "@/components/dashboard/InitiateDashboard";
import { ElevateDashboard } from "@/components/dashboard/ElevateDashboard";
import { CustomDashboard } from "@/components/dashboard/CustomDashboard";

// Context
import { usePlan } from "@/contexts/PlanContext";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { currentPlan } = usePlan();

  const quickStats = [
    {
      title: "Total Leads",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Active Automations",
      value: "23",
      change: "+3",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Messages Sent",
      value: "8,432",
      change: "+28%",
      icon: MessageSquare,
      color: "text-purple-500"
    },
    {
      title: "Appointments",
      value: "156",
      change: "+7",
      icon: Calendar,
      color: "text-orange-500"
    }
  ];

  const renderPlanDashboard = () => {
    switch (currentPlan) {
      case 'initiate':
        return <InitiateDashboard />;
      case 'elevate':
        return <ElevateDashboard />;
      case 'custom':
        return <CustomDashboard />;
      default:
        return <InitiateDashboard />;
    }
  };

  const recentActivities = [
    {
      type: "lead",
      message: "New lead captured from website",
      time: "2 minutes ago",
      status: "new"
    },
    {
      type: "automation",
      message: "Welcome email sequence completed",
      time: "15 minutes ago",
      status: "completed"
    },
    {
      type: "appointment",
      message: "Meeting scheduled with John Smith",
      time: "1 hour ago",
      status: "scheduled"
    },
    {
      type: "message",
      message: "WhatsApp message sent to 5 contacts",
      time: "2 hours ago",
      status: "sent"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
              <Button variant="hero" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Trial Status Banner */}
        <TrialStatusBanner />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="glass-effect border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-green-500">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-primary/10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 glass-effect">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="crm">CRM</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="communications">Messages</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                {renderPlanDashboard()}
              </TabsContent>

              <TabsContent value="crm" className="mt-6">
                <CRMTab />
              </TabsContent>

              <TabsContent value="automation" className="mt-6">
                <AutomationTab />
              </TabsContent>

              <TabsContent value="communications" className="mt-6">
                <CommunicationsTab />
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <CalendarTab />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <SettingsTab />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Selector */}
            <PlanSelector />

            {/* Recent Activity */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'new' ? 'bg-blue-500' :
                      activity.status === 'completed' ? 'bg-green-500' :
                      activity.status === 'scheduled' ? 'bg-orange-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Contact
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Create Automation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

