import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap,
  Plus,
  Trash2,
  Play,
  Pause,
  Settings,
  Mail,
  Users,
  Calendar,
  MessageSquare,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface AutomationStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  name: string;
  config: {
    triggerType?: 'email_signup' | 'email_opened' | 'time_delay' | 'page_visit';
    actionType?: 'send_email' | 'add_tag' | 'schedule_task' | 'update_field';
    conditionType?: 'has_tag' | 'email_count' | 'time_since_signup';
    [key: string]: any;
  };
}

interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
  type: 'welcome' | 'follow_up' | 'promotion' | 'reminder';
}

export const BasicAutomationBuilder = () => {
  const { toast } = useToast();
  const [automationName, setAutomationName] = useState("Welcome Sequence");
  const [isEnabled, setIsEnabled] = useState(true);
  const [steps, setSteps] = useState<AutomationStep[]>([
    {
      id: '1',
      type: 'trigger',
      name: 'Email Signup',
      config: {
        triggerType: 'email_signup',
        list: 'Main List'
      }
    },
    {
      id: '2', 
      type: 'action',
      name: 'Send Welcome Email',
      config: {
        actionType: 'send_email',
        template: 'welcome',
        delay: 0
      }
    },
    {
      id: '3',
      type: 'action', 
      name: 'Add Tag',
      config: {
        actionType: 'add_tag',
        tag: 'subscriber'
      }
    }
  ]);
  
  const [emailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'welcome',
      subject: 'Welcome! Let\'s get started',
      content: 'Thank you for joining us! We\'re excited to have you on board.',
      type: 'welcome'
    },
    {
      id: 'follow_up',
      subject: 'Here\'s what you can expect',
      content: 'Over the next few days, we\'ll send you helpful resources.',
      type: 'follow_up'
    },
    {
      id: 'promotion',
      subject: 'Special offer just for you',
      content: 'As a subscriber, you get 20% off your first purchase.',
      type: 'promotion'
    }
  ]);

  const [automationStats] = useState({
    totalSent: 1247,
    openRate: 68.4,
    clickRate: 12.7,
    unsubscribeRate: 0.3
  });

  const addStep = (type: AutomationStep['type']) => {
    const newStep: AutomationStep = {
      id: Date.now().toString(),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
      config: {}
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, updates: Partial<AutomationStep>) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const saveAutomation = () => {
    toast({
      title: "Automation Saved",
      description: "Your automation has been saved and is now active.",
    });
  };

  const testAutomation = () => {
    toast({
      title: "Testing Automation",
      description: "Sending test email to your address...",
    });
  };

  const getStepIcon = (step: AutomationStep) => {
    switch (step.type) {
      case 'trigger':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'condition':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'action':
        return <Zap className="h-4 w-4 text-blue-500" />;
    }
  };

  const getActionOptions = (step: AutomationStep) => {
    switch (step.config.actionType) {
      case 'send_email':
        return (
          <div className="space-y-2">
            <Label>Email Template</Label>
            <select 
              className="w-full p-2 border rounded"
              value={step.config.template || ''}
              onChange={(e) => updateStep(step.id, { 
                config: { ...step.config, template: e.target.value }
              })}
            >
              <option value="">Select template</option>
              {emailTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.subject}
                </option>
              ))}
            </select>
            <Label>Delay (hours)</Label>
            <Input
              type="number"
              value={step.config.delay || 0}
              onChange={(e) => updateStep(step.id, {
                config: { ...step.config, delay: parseInt(e.target.value) }
              })}
              placeholder="0"
            />
          </div>
        );
      case 'add_tag':
        return (
          <div>
            <Label>Tag Name</Label>
            <Input
              value={step.config.tag || ''}
              onChange={(e) => updateStep(step.id, {
                config: { ...step.config, tag: e.target.value }
              })}
              placeholder="Enter tag name"
            />
          </div>
        );
      default:
        return <div className="text-sm text-muted-foreground">No additional options</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Automation Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Basic Automation Builder</h3>
          <p className="text-sm text-muted-foreground">Create simple email sequences and workflows</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={testAutomation}>
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>
          <Button variant="hero" size="sm" onClick={saveAutomation}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Automation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Builder Panel */}
        <div className="space-y-4">
          {/* Automation Settings */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Automation Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="automation-name">Name</Label>
                <Input
                  id="automation-name"
                  value={automationName}
                  onChange={(e) => setAutomationName(e.target.value)}
                  placeholder="Enter automation name"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
                <Label className="text-sm">Automation Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={isEnabled ? "default" : "outline"}>
                  {isEnabled ? "Active" : "Paused"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Basic Plan
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Add Steps */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Add Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => addStep('trigger')}
                  className="w-full justify-start"
                >
                  <Play className="h-4 w-4 mr-2 text-green-500" />
                  Add Trigger
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addStep('condition')}
                  className="w-full justify-start"
                >
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                  Add Condition
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addStep('action')}
                  className="w-full justify-start"
                >
                  <Zap className="h-4 w-4 mr-2 text-blue-500" />
                  Add Action
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Templates */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>Email Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="p-3 border border-primary/10 rounded-lg">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">{template.subject}</h5>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.content}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {template.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automation Flow */}
        <div className="lg:col-span-2">
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Automation Flow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Connector Line */}
                    {index > 0 && (
                      <div className="absolute left-4 top-0 w-px h-6 bg-primary/20 -translate-y-full" />
                    )}
                    
                    <Card className="border-primary/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              {getStepIcon(step)}
                            </div>
                            <div className="flex-1">
                              <Input
                                value={step.name}
                                onChange={(e) => updateStep(step.id, { name: e.target.value })}
                                placeholder="Step name"
                                className="mb-2"
                              />
                              
                              {/* Step Configuration */}
                              <div className="space-y-2">
                                {step.type === 'trigger' && (
                                  <div>
                                    <Label className="text-xs">Trigger Type</Label>
                                      <select 
                                        className="w-full p-2 border rounded text-sm"
                                        value={step.config.triggerType || ''}
                                      onChange={(e) => updateStep(step.id, {
                                        config: { ...step.config, triggerType: e.target.value }
                                      })}
                                    >
                                      <option value="">Select trigger</option>
                                      <option value="email_signup">Email Signup</option>
                                      <option value="email_opened">Email Opened</option>
                                      <option value="page_visit">Page Visit</option>
                                      <option value="time_delay">Time Delay</option>
                                    </select>
                                  </div>
                                )}
                                
                                {step.type === 'action' && (
                                  <div className="space-y-2">
                                    <Label className="text-xs">Action Type</Label>
                                    <select 
                                      className="w-full p-2 border rounded text-sm"
                                      value={step.config.actionType || ''}
                                      onChange={(e) => updateStep(step.id, {
                                        config: { ...step.config, actionType: e.target.value }
                                      })}
                                    >
                                      <option value="">Select action</option>
                                      <option value="send_email">Send Email</option>
                                      <option value="add_tag">Add Tag</option>
                                      <option value="schedule_task">Schedule Task</option>
                                      <option value="update_field">Update Field</option>
                                    </select>
                                    
                                    {getActionOptions(step)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeStep(step.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Automation Statistics */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Automation Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{automationStats.totalSent}</div>
              <div className="text-sm text-muted-foreground">Emails Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{automationStats.openRate}%</div>
              <div className="text-sm text-muted-foreground">Open Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{automationStats.clickRate}%</div>
              <div className="text-sm text-muted-foreground">Click Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{automationStats.unsubscribeRate}%</div>
              <div className="text-sm text-muted-foreground">Unsubscribe Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
