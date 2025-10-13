import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/contexts/PlanContext";
import { AIAutomationBuilder } from "./tools/AIAutomationBuilder";
import { WhatsAppConsole } from "./tools/WhatsAppConsole";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Globe,
  Zap,
  Bot,
  TrendingUp,
  Share2,
  Award,
  Crown,
  Smartphone,
  BarChart3,
  Settings,
  Plus,
  Brain,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ElevateDashboard = () => {
  const { upgradePrompt, hasFeature, currentPlan } = usePlan();
  const [activeTool, setActiveTool] = useState("ai-automation");

  const advancedFeatures = [
    {
      id: 'ai-automation',
      title: 'AI Automation Integration',
      description: 'Smart automations powered by artificial intelligence',
      icon: Bot,
      usage: { current: 12, limit: 20 },
      status: 'active',
      aiPowered: true
    },
    {
      id: 'lead-intake',
      title: 'Lead Intake Automations',
      description: 'Automatically capture and qualify new leads',
      icon: Users,
      usage: { current: 8, limit: 20 },
      status: 'active',
      aiPowered: true
    },
    {
      id: 'marketing-automation',
      title: 'Sales & Marketing Automations',
      description: 'Automated sequences for nurturing and converting leads',
      icon: TrendingUp,
      usage: { current: 15, limit: 20 },
      status: 'active',
      aiPowered: true
    },
    {
      id: 'website-integration',
      title: 'Website Integration & Hosting',
      description: 'Advanced website hosting with automatic optimization',
      icon: Globe,
      usage: { current: 3, limit: -1 },
      status: 'active'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp & Slack Integration',
      description: 'Connect with customers via WhatsApp and team via Slack',
      icon: Smartphone,
      usage: { current: 56, limit: -1 },
      status: 'active'
    },
    {
      id: 'seo',
      title: 'Automatic SEO Optimization',
      description: 'AI-powered SEO optimization for your content',
      icon: TrendingUp,
      usage: { current: 12, limit: -1 },
      status: 'active',
      aiPowered: true
    },
    {
      id: 'affiliate',
      title: 'Affiliate Program & Management',
      description: 'Built-in affiliate program with automated payouts',
      icon: Share2,
      usage: { current: 23, limit: -1 },
      status: 'active'
    },
    {
      id: 'community',
      title: 'Memberships, Community & App Builder',
      description: 'Create communities and build mobile apps',
      icon: Award,
      usage: { current: 2, limit: -1 },
      status: 'active'
    }
  ];

  const analytics = [
    {
      title: 'Lead Conversion Rate',
      value: '34.2%',
      change: '+8.5%',
      trend: 'up',
      aiInsight: 'AI optimization increased conversions by 12%'
    },
    {
      title: 'Revenue Growth',
      value: '$18,420',
      change: '+23.1%',
      trend: 'up',
      aiInsight: 'Automated nurturing sequences driving results'
    },
    {
      title: 'Active Automations',
      value: '35',
      change: '+6',
      trend: 'up',
      aiInsight: 'All automations running optimally'
    },
    {
      title: 'Affiliate Commissions',
      value: '$2,340',
      change: '+45.2%',
      trend: 'up',
      aiInsight: 'New affiliate recruitment successful'
    }
  ];

  const upcomingAdvancedFeatures = [
    {
      title: 'White-label Solutions',
      description: 'Rebrand the entire platform under your brand',
      plan: 'Custom',
      icon: Crown
    },
    {
      title: 'Custom API Integrations', 
      description: 'Connect to any third-party service with custom APIs',
      plan: 'Custom',
      icon: Settings
    },
    {
      title: 'Agency Management Tools',
      description: 'Advanced tools for managing multiple client accounts',
      plan: 'Custom',
      icon: Users
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
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold gradient-text">Elevate Plan - Advanced Growth!</h2>
              <p className="text-muted-foreground">
                You're leveraging AI-powered automations and unlimited scaling capabilities. 
                Your business is ready to scale to the next level.
              </p>
            </div>
            <div className="hidden md:block">
              <Badge variant="outline" className="px-3 py-1 bg-gradient-primary text-primary-foreground border-primary">
                <Bot className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Unlimited</div>
              <div className="text-sm text-muted-foreground">Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">35</div>
              <div className="text-sm text-muted-foreground">Active Automations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">23</div>
              <div className="text-sm text-muted-foreground">Affiliate Partners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">2</div>
              <div className="text-sm text-muted-foreground">Apps Built</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Analytics */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI-Powered Analytics</span>
            <Badge variant="outline" className="ml-2">
              <Bot className="h-3 w-3 mr-1" />
              AI Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.map((metric, index) => (
              <Card key={index} className="glass-effect border-primary/10">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                      <div className="flex items-center space-x-1 text-green-500">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs">{metric.change}</span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground">{metric.value}</div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Bot className="h-3 w-3 mr-1" />
                      {metric.aiInsight}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <span>Advanced Features</span>
          <Badge variant="outline">
            <Zap className="h-3 w-3 mr-1" />
            Unlimited
          </Badge>
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {advancedFeatures.map((feature) => (
            <Card 
              key={feature.id} 
              className={`glass-effect border-primary/20 ${feature.aiPowered ? 'border-primary/40' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${feature.aiPowered ? 'bg-gradient-primary' : 'bg-primary/10'}`}>
                      <feature.icon className={`h-5 w-5 ${feature.aiPowered ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  {feature.aiPowered && (
                    <Badge className="text-xs bg-gradient-primary text-primary-foreground">
                      <Bot className="h-3 w-3 mr-1" />
                      AI
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
                  {feature.aiPowered && (
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Bot className="h-3 w-3 mr-1" />
                      Powered by AI automation
                    </div>
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
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Advanced Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-sm">Create AI Automation</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Smartphone className="h-6 w-6 text-primary" />
              <span className="text-sm">Setup WhatsApp</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Share2 className="h-6 w-6 text-primary" />
              <span className="text-sm">Manage Affiliates</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-sm">Publish App</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Business Tools */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Advanced Business Tools</span>
            <Badge className="bg-gradient-primary text-primary-foreground">
              <Bot className="h-3 w-3 mr-1" />
              AI Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass-effect">
              <TabsTrigger value="ai-automation" className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <span>AI Automation</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>WhatsApp Console</span>
              </TabsTrigger>
              <TabsTrigger value="affiliate" className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Affiliate Manager</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>SEO Optimizer</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-automation" className="mt-6">
              <AIAutomationBuilder />
            </TabsContent>

            <TabsContent value="whatsapp" className="mt-6">
              <WhatsAppConsole />
            </TabsContent>

            <TabsContent value="affiliate" className="mt-6">
              <Card className="glass-effect border-primary/20">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <Share2 className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-lg font-semibold">Affiliate Program Manager</h3>
                    <p className="text-muted-foreground">
                      Manage your affiliate program with automated payouts, tracking, and performance analytics.
                    </p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-primary/10">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-500">23</div>
                            <div className="text-sm text-muted-foreground">Active Affiliates</div>
                          </CardContent>
                        </Card>
                        <Card className="border-primary/10">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-500">$2,340</div>
                            <div className="text-sm text-muted-foreground">Commissions Paid</div>
                          </CardContent>
                        </Card>
                        <Card className="border-primary/10">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-500">12.5%</div>
                            <div className="text-sm text-muted-foreground">Conversion Rate</div>
                          </CardContent>
                        </Card>
                      </div>
                      <Button variant="hero">
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Affiliate Program
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="mt-6">
              <Card className="glass-effect border-primary/20">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <Brain className="h-12 w-12 mx-auto text-primary" />
                    <h3 className="text-lg font-semibold">AI SEO Optimizer</h3>
                    <p className="text-muted-foreground">
                      Automatically optimize your content for search engines with AI-powered suggestions.
                    </p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">87</div>
                            <div className="text-sm text-muted-foreground">SEO Score</div>
                          </CardContent>
                        </Card>
                        <Card className="border-blue-200 bg-blue-50">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">+34%</div>
                            <div className="text-sm text-muted-foreground">Traffic Growth</div>
                          </CardContent>
                        </Card>
                        <Card className="border-purple-200 bg-purple-50">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">156</div>
                            <div className="text-sm text-muted-foreground">Keywords Ranked</div>
                          </CardContent>
                        </Card>
                      </div>
                      <Button variant="hero">
                        <Plus className="h-4 w-4 mr-2" />
                        Optimize Website
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Custom Plan Suggestions */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span>Ready for Agency Level? Upgrade to Custom</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAdvancedFeatures.map((feature, index) => (
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
                    Upgrade to Custom
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
