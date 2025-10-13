import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlan } from "@/contexts/PlanContext";
import { useState } from "react";
import { LeadCaptureBuilder } from "./tools/LeadCaptureBuilder";
import { WebsiteBuilder } from "./tools/WebsiteBuilder";
import { BasicAutomationBuilder } from "./tools/BasicAutomationBuilder";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Globe,
  BookOpen,
  Zap,
  TrendingUp,
  AlertTriangle,
  Crown,
  Plus,
  Settings,
  BarChart3
} from "lucide-react";

export const InitiateDashboard = () => {
  const { upgradePrompt, hasFeature, currentPlan } = usePlan();
  const [activeTool, setActiveTool] = useState("leads");

  const features = [
    {
      id: 'crm',
      title: 'CRM & Pipeline Management',
      description: 'Manage your contacts and track deals through your sales pipeline',
      icon: Users,
      usage: { current: 142, limit: 500 },
      status: 'active'
    },
    {
      id: 'website',
      title: 'Website Builder',
      description: 'Build and customize your business website with ease',
      icon: Globe,
      usage: { current: 1, limit: 1 },
      status: 'active'
    },
    {
      id: 'course',
      title: 'Course Builder',
      description: 'Create and manage online courses for your audience',
      icon: BookOpen,
      usage: { current: 2, limit: 5 },
      status: 'active'
    },
    {
      id:  'automation',
      title: 'Basic Automation Builder',
      description: 'Set up simple automated workflows for your business',
      icon: Zap,
      usage: { current: 3, limit: 5 },
      status: 'limited'
    },
    {
      id: 'calendar',
      title: 'Calendar Management',
      description: 'Schedule appointments and manage your calendar',
      icon: Calendar,
      usage: { current: 67, limit: -1 },
      status: 'active'
    },
    {
      id: 'messages',
      title: 'All-In-One Conversations',
      description: 'Unified inbox for emails and basic messaging',
      icon: MessageSquare,
      usage: { current: 89, limit: -1 },
      status: 'active'
    }
  ];

  const upcomingFeatures = [
    {
      title: 'AI-Powered Automations',
      description: 'Unlock smart automation capabilities with AI',
      plan: 'Elevate',
      icon: Zap
    },
    {
      title: 'Advanced Lead Scoring', 
      description: 'Automatically score and prioritize your leads',
      plan: 'Elevate',
      icon: TrendingUp
    },
    {
      title: 'WhatsApp Integration',
      description: 'Connect with customers via WhatsApp messaging',
      plan: 'Elevate',
      icon: MessageSquare
    }
  ];

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 100; // unlimited
    return Math.round((current / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="glass-effect border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold gradient-text">Welcome to Initiate Plan!</h2>
              <p className="text-muted-foreground">
                You're getting started with the essential business automation tools. 
                Complete your setup and watch your business grow.
              </p>
            </div>
            <div className="hidden md:block">
              <Badge variant="outline" className="px-3 py-1">
                Getting Started
              </Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">75%</div>
              <div className="text-sm text-muted-foreground">Setup Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">142</div>
              <div className="text-sm text-muted-foreground">Contacts Added</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">3/5</div>
              <div className="text-sm text-muted-foreground">Automations Used</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Usage */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Feature Usage</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.id} className="glass-effect border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  {feature.status === 'limited' && (
                    <Badge variant="outline" className="text-xs">
                      Limited
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span className={getUsageColor(getUsagePercentage(feature.usage.current, feature.usage.limit))}>
                      {feature.usage.current} / {feature.usage.limit === -1 ? '∞' : feature.usage.limit}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(feature.usage.current, feature.usage.limit)} 
                    className="h-2"
                  />
                  {feature.status === 'limited' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => upgradePrompt(feature.title)}
                      className="w-full mt-2"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Unlock More
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Users className="h-6 w-6 text-primary" />
              <span className="text-sm">Import Contacts</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-sm">Build Website</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-sm">Create Automation</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-sm">Build Course</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Tools */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Business Tools</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass-effect">
              <TabsTrigger value="leads" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Lead Capture</span>
              </TabsTrigger>
              <TabsTrigger value="website" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Website</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Automation</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="mt-6">
              <LeadCaptureBuilder />
            </TabsContent>

            <TabsContent value="website" className="mt-6">
              <WebsiteBuilder />
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <Card className="glass-effect border-primary/20">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <BookOpen className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-lg font-semibold">Course Builder</h3>
                    <p className="text-muted-foreground">
                      Create and sell online courses to your audience. Upload videos, create lessons, and manage students.
                    </p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-primary/10">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-500">3</div>
                            <div className="text-sm text-muted-foreground">Active Courses</div>
                          </CardContent>
                        </Card>
                        <Card className="border-primary/10">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-500">127</div>
                            <div className="text-sm text-muted-foreground">Students</div>
                          </CardContent>
                        </Card>
                        <Card className="border-primary/10">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-500">$2,340</div>
                            <div className="text-sm text-muted-foreground">Revenue</div>
                          </CardContent>
                        </Card>
                      </div>
                      <Button variant="hero">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Course
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="automation" className="mt-6">
              <BasicAutomationBuilder />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upgrade Suggestions */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 h-5 text-yellow-500" />
            <span>Ready to Grow? Upgrade Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <feature.icon className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {feature.plan}
                  </Badge>
                  <Button size="sm" onClick={() => upgradePrompt(feature.title)}>
                    Upgrade
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
