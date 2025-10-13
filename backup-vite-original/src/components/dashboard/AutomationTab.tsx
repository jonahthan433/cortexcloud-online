import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Users, 
  Mail, 
  MessageSquare,
  Calendar,
  Zap,
  TrendingUp,
  Clock,
  Bot,
  Crown,
  Brain
} from "lucide-react";
import { FeatureGate } from "./FeatureGate";

export const AutomationTab = () => {
  const { toast } = useToast();
  
  const initialAutomations = [
    {
      id: 1,
      name: "Welcome Email Sequence",
      type: "Email",
      status: "Active",
      contacts: 156,
      completion: 89,
      lastRun: "2 hours ago",
      description: "Automatically sends welcome emails to new subscribers"
    },
    {
      id: 2,
      name: "Lead Nurturing Campaign",
      type: "Email",
      status: "Active",
      contacts: 89,
      completion: 67,
      lastRun: "1 day ago",
      description: "Follow-up sequence for qualified leads"
    },
    {
      id: 3,
      name: "WhatsApp Follow-up",
      type: "WhatsApp",
      status: "Paused",
      contacts: 45,
      completion: 23,
      lastRun: "3 days ago",
      description: "Automated WhatsApp messages for appointment reminders"
    },
    {
      id: 4,
      name: "Social Media Scheduler",
      type: "Social",
      status: "Active",
      contacts: 234,
      completion: 95,
      lastRun: "30 minutes ago",
      description: "Automatically posts content across social platforms"
    }
  ];

  const [automations, setAutomations] = useState(initialAutomations);

  const handleCreateAutomation = () => {
    toast({
      title: "Create Automation",
      description: "Opening automation builder...",
    });
  };

  const handleToggleAutomation = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    setAutomations(prev => prev.map(auto => 
      auto.id === id ? { ...auto, status: newStatus } : auto
    ));
    toast({
      title: `Automation ${newStatus}`,
      description: `Automation has been ${newStatus.toLowerCase()}.`,
    });
  };

  const handleAutomationAction = (action: string, automationName: string) => {
    toast({
      title: `${action} ${automationName}`,
      description: `${action} action initiated...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
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
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Automation Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Automation Builder</h2>
          <p className="text-muted-foreground">Create and manage your automated workflows</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleCreateAutomation}>
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">12</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">3</div>
            <div className="text-sm text-muted-foreground">Paused</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">524</div>
            <div className="text-sm text-muted-foreground">Total Contacts</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">78%</div>
            <div className="text-sm text-muted-foreground">Avg. Completion</div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Automations */}
      <FeatureGate 
        feature="AI-Powered Automations"
        requiredPlan="elevate"
        upgradeMessage="Unlock intelligent automations powered by AI that learn and optimize from your data."
      >
        <Card className="glass-effect border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>AI-Powered Automations</span>
              <Badge className="bg-gradient-primary text-primary-foreground">
                <Bot className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card className="glass-effect border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
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
              
              <Card className="glass-effect border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
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
              
              <Card className="glass-effect border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
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
            
            <div className="space-y-4">
              <h4 className="font-medium">AI Automation Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Bot className="h-5 w-5 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Intelligent Follow-up</div>
                    <div className="text-xs text-muted-foreground">AI decides when and how to follow up</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Auto Lead Qualification</div>
                    <div className="text-xs text-muted-foreground">AI scores and prioritizes leads</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Smart Scheduling</div>
                    <div className="text-xs text-muted-foreground">AI optimizes meeting times</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Dynamic Email Copy</div>
                    <div className="text-xs text-muted-foreground">AI personalizes messages</div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FeatureGate>

      {/* Automation List */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="glass-effect border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {getTypeIcon(automation.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{automation.name}</h3>
                    <p className="text-sm text-muted-foreground">{automation.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        <Users className="h-3 w-3 inline mr-1" />
                        {automation.contacts} contacts
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {automation.lastRun}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{automation.completion}%</div>
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAutomationAction("Configure", automation.name)}
                    >
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
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleAutomationAction("Create", "Email Automation")}
            >
              <Mail className="h-6 w-6" />
              <span>Email Automation</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleAutomationAction("Create", "WhatsApp Flow")}
            >
              <MessageSquare className="h-6 w-6" />
              <span>WhatsApp Flow</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleAutomationAction("Create", "Appointment Reminders")}
            >
              <Calendar className="h-6 w-6" />
              <span>Appointment Reminders</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};