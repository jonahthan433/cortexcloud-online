import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/contexts/PlanContext";
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
  Building2,
  Briefcase,
  Headphones,
  Palette,
  Code,
  Shield
} from "lucide-react";

export const CustomDashboard = () => {
  const { upgradePrompt, hasFeature, currentPlan } = usePlan();

  const agencyFeatures = [
    {
      id: 'agency-automations',
      title: 'Agency Automations',
      description: 'Advanced automations for managing multiple client accounts',
      icon: Building2,
      usage: { current: 45, limit: -1 },
      status: 'active',
      type: 'agency'
    },
    {
      id: 'agency-sales-drips',
      title: 'Agency Sales & Marketing Drips',
      description: 'Pre-built sales sequences for client onboarding and retention',
      icon: TrendingUp,
      usage: { current: 18, limit: -1 },
      status: 'active',
      type: 'agency'
    },
    {
      id: 'lead-distribution',
      title: 'Agency Lead Intake & Distribution',
      description: 'Automated lead routing and distribution across team members',
      icon: Share2,
      usage: { current: 127, limit: -1 },
      status: 'active',
      type: 'agency'
    },
    {
      id: 'qualifying-forms',
      title: 'Agency Qualifying Forms & Surveys',
      description: 'Client onboarding and assessment forms with smart routing',
      icon: MessageSquare,
      usage: { current: 23, limit: -1 },
      status: 'active',
      type: 'agency'
    },
    {
      id: 'calendar-setup',
      title: 'Agency Calendar Setup',
      description: 'Multi-client calendar management with automated booking',
      icon: Calendar,
      usage: { current: 34, limit: -1 },
      status: 'active',
      type: 'agency'
    },
    {
      id: 'reseller-license',
      title: 'Resellers License',
      description: 'Complete licensing to sell and manage multiple accounts',
      icon: Shield,
      usage: { current: 1, limit: -1 },
      status: 'active',
      type: 'license'
    },
    {
      id: 'dedicated-manager',
      title: 'Dedicated Account Manager',
      description: 'Personal account manager for strategy and optimization',
      icon: Headphones,
      usage: { current: 1, limit: 1 },
      status: 'active',
      type: 'service'
    },
    {
      id: 'custom-integrations',
      title: 'Custom Integrations',
      description: 'Tailored API integrations for unique business needs',
      icon: Code,
      usage: { current: 8, limit: -1 },
      status: 'active',
      type: 'custom'
    },
    {
      id: 'white-label',
      title: 'White-label Options',
      description: 'Completely rebrand the platform under your company identity',
      icon: Palette,
      usage: { current: 3, limit: -1 },
      status: 'active',
      type: 'white-label'
    }
  ];

  const agencyMetrics = [
    {
      title: 'Total Client Accounts',
      value: '47',
      change: '+12',
      trend: 'up',
      description: 'Active managed accounts'
    },
    {
      title: 'Monthly Recurring Revenue',
      value: '$47,200',
      change: '+18.5%',
      trend: 'up',
      description: 'Across all client accounts'
    },
    {
      title: 'Automated Processes',
      value: '156',
      change: '+23',
      trend: 'up',
      description: 'Active agency automations'
    },
    {
      title: 'Team Efficiency',
      value: '94%',
      change: '+8.2%',
      trend: 'up',
      description: 'Automation efficiency score'
    }
  ];

  const clientManagement = [
    {
      name: 'TechStart Solutions',
      revenue: '$2,400',
      status: 'active',
      lastActivity: '2 hours ago',
      automations: 12
    },
    {
      name: 'GrowthMarketing Pro',
      revenue: '$1,800',
      status: 'active',
      lastActivity: '5 minutes ago',
      automations: 8
    },
    {
      name: 'Digital Agency Inc',
      revenue: '$3,200',
      status: 'setup',
      lastActivity: '1 day ago',
      automations: 3
    },
    {
      name: 'BusinessBoost Co',
      revenue: '$1,200',
      status: 'active',
      lastActivity: '3 hours ago',
      automations: 6
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100';
      case 'setup': return 'text-yellow-500 bg-yellow-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="glass-effect border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Crown className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold gradient-text">Custom Plan - Agency Leader!</h2>
              <p className="text-muted-foreground">
                You're operating at the highest level with full agency capabilities. 
                Congratulations on achieving complete business automation mastery.
              </p>
            </div>
            <div className="hidden md:block">
              <Badge variant="outline" className="px-3 py-1 bg-gradient-primary text-primary-foreground border-primary">
                <Crown className="h-3 w-3 mr-1" />
                Agency Plan
              </Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">47</div>
              <div className="text-sm text-muted-foreground">Active Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">156</div>
              <div className="text-sm text-muted-foreground">Agency Automations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">8</div>
              <div className="text-sm text-muted-foreground">Custom Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">3</div>
              <div className="text-sm text-muted-foreground">White-label Brands</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agency Performance */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Agency Performance Dashboard</span>
            <Badge variant="outline" className="ml-2">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agencyMetrics.map((metric, index) => (
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
                    <div className="text-xs text-muted-foreground">
                      {metric.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agency Features Overview */}
      <div>
        {['agency', 'service', 'custom', 'white-label', 'license'].map(featureType => (
          <div key={featureType} className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="capitalize">{featureType.replace('-', ' ')} Features</span>
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                Unlimited
              </Badge>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {agencyFeatures.filter(f => f.type === featureType).map((feature) => (
                <Card 
                  key={feature.id} 
                  className="glass-effect border-primary/30 shadow-glow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={feature.type === 'agency' ? 'p-2 bg-gradient-primary rounded-lg' : 'p-2 bg-primary/10 rounded-lg'}>
                          <feature.icon className={`h-5 w-5 ${feature.type === 'agency' ? 'text-primary-foreground' : 'text-primary'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <Badge className="text-xs bg-gradient-primary text-primary-foreground">
                        {feature.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usage</span>
                        <span className="text-green-500">
                          {feature.usage.current} / ∞
                        </span>
                      </div>
                      <Progress value={100} className="h-2" />
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Crown className="h-3 w-3 mr-1" />
                        Full agency capabilities unlimited
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Client Management */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Top Client Accounts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientManagement.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.automations} automations • {client.lastActivity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{client.revenue}/month</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Agency Management Tools</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-sm">Add Client Account</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-sm">Create Agency Automation</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="text-sm">Custom Integration</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Palette className="h-6 w-6 text-primary" />
              <span className="text-sm">White-label Setup</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Congratulations */}
      <Card className="glass-effect border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-gradient-primary rounded-full w-fit mx-auto">
              <Crown className="h-12 w-12 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold gradient-text">You've Reached the Top!</h3>
              <p className="text-muted-foreground">
                As a Custom Plan user, you have access to the most powerful business automation platform available.
                Thank you for choosing the ultimate solution for agency-level business management.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button variant="hero">
                <Headphones className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
