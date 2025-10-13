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
  Bot,
  Brain,
  Zap,
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  Calendar,
  Smartphone,
  Mail,
  Plus,
  Trash2,
  Play,
  Pause,
  Settings,
  CheckCircle,
  Sparkles,
  BarChart3
} from "lucide-react";

interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  steps: AIWorkflowStep[];
  performance: {
    leadsGenerated: number;
    conversionRate: number;
    avgResponseTime: string;
    satisfactionScore: number;
  };
}

interface AIWorkflowStep {
  id: string;
  type: 'ai_analysis' | 'smart_response' | 'lead_scoring' | 'content_generation' | 'personalization';
  name: string;
  config: {
    modelType?: 'gpt-4' | 'claude-3' | 'gemini-pro';
    prompt?: string;
    threshold?: number;
    context?: string;
    learning?: boolean;
  };
}

export const AIAutomationBuilder = () => {
  const { toast } = useToast();
  const [selectedWorkflow, setSelectedWorkflow] = useState(0);
  const [workflows] = useState<AIWorkflow[]>([
    {
      id: 'lead-qualification',
      name: 'Intelligent Lead Qualification',
      description: 'AI analyzes incoming leads and automatically scores them based on intent and demographics',
      isActive: true,
      performance: {
        leadsGenerated: 247,
        conversionRate: 87.3,
        avgResponseTime: '2.3 min',
        satisfactionScore: 4.8
      },
      steps: [
        {
          id: '1',
          type: 'ai_analysis',
          name: 'AI Lead Analysis',
          config: {
            modelType: 'gpt-4',
            prompt: 'Analyze this lead: score intent (1-10), identify key characteristics, predict conversion probability',
            learning: true
          }
        },
        {
          id: '2',
          type: 'lead_scoring',
          name: 'Smart Lead Scoring',
          config: {
            threshold: 7,
            context: 'Enterprise buyers, immediate purchase intent'
          }
        },
        {
          id: '3',
          type: 'personalization',
          name: 'Personalized Response',
          config: {
            modelType: 'claude-3',
            prompt: 'Generate personalized response based on lead analysis and company context'
          }
        }
      ]
    },
    {
      id: 'support-automation',
      name: 'AI Customer Support',
      description: 'Intelligent chatbot handles customer inquiries with context-aware responses',
      isActive: true,
      performance: {
        leadsGenerated: 89,
        conversionRate: 92.1,
        avgResponseTime: '45 sec',
        satisfactionScore: 4.9
      },
      steps: [
        {
          id: '1',
          type: 'ai_analysis',
          name: 'Intent Recognition',
          config: {
            modelType: 'gpt-4',
            prompt: 'Classify customer intent: inquiry, complaint, sales interest, support',
            learning: true
          }
        },
        {
          id: '2',
          type: 'smart_response',
          name: 'Context-Aware Response',
          config: {
            modelType: 'claude-3',
            prompt: 'Generate helpful, empathetic response based on classification and customer history'
          }
        }
      ]
    }
  ]);

  const [templateLibrary] = useState([
    {
      id: 'sales-sequence',
      name: 'AI Sales Sequence',
      description: 'Intelligent follow-up sequences that adapt to prospect behavior',
      icon: Target,
      difficulty: 'Intermediate',
      duration: '5-10 min setup'
    },
    {
      id: 'content-personalization',
      name: 'Content Personalization',
      description: 'AI personalizes emails, pages, and communications for each visitor',
      icon: Brain,
      difficulty: 'Advanced',
      duration: '15-20 min setup'
    },
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics',
      description: 'AI predicts customer behavior and triggers proactive actions',
      icon: TrendingUp,
      difficulty: 'Advanced',
      duration: '10-15 min setup'
    }
  ]);

  const createWorkflow = (templateId: string) => {
    toast({
      title: "Creating AI Workflow",
      description: `Starting setup for ${templateId.replace('-', ' ')} workflow...`,
    });
  };

  const toggleWorkflow = (workflowIndex: number) => {
    const updatedWorkflows = [...workflows];
    updatedWorkflows[workflowIndex].isActive = !updatedWorkflows[workflowIndex].isActive;
    
    toast({
      title: updatedWorkflows[workflowIndex].isActive ? "Workflow Activated" : "Workflow Paused",
      description: updatedWorkflows[workflowIndex].isActive 
        ? "AI workflow is now processing leads automatically."
        : "AI workflow has been paused.",
    });
  };

  const testWorkflow = (workflowIndex: number) => {
    toast({
      title: "Testing AI Workflow",
      description: "Running test scenarios... AI is learning from test data.",
    });
  };

  const currentWorkflow = workflows[selectedWorkflow];

  return (
    <div className="space-y-6">
      {/* AI Builder Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span>AI Automation Builder</span>
            <Badge className="bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Enhanced
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground">Create intelligent automations powered by artificial intelligence</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => testWorkflow(selectedWorkflow)}>
            <Play className="h-4 w-4 mr-2" />
            Test Workflow
          </Button>
          <Button variant="hero" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Workflow Templates */}
        <div className="xl:col-span-1 space-y-4">
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>AI Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templateLibrary.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <Card 
                      key={template.id}
                      className="cursor-pointer border-primary/10 hover:border-primary/30 transition-colors"
                      onClick={() => createWorkflow(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <h4 className="font-medium text-sm">{template.name}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              {template.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {template.duration}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Performance Stats */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>AI Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">94.2%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">23</div>
                    <div className="text-xs text-muted-foreground">Active Models</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">98%</div>
                    <div className="text-xs text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">4.9/5</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Workflow Builder */}
        <div className="xl:col-span-2 space-y-6">
          {/* Workflow Selection */}
          <div className="flex space-x-2">
            {workflows.map((workflow, index) => (
              <Button
                key={workflow.id}
                variant={selectedWorkflow === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedWorkflow(index)}
                className="flex items-center space-x-2"
              >
                <Bot className="h-4 w-4" />
                <span>{workflow.name}</span>
                {workflow.isActive && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </Button>
            ))}
          </div>

          {/* Selected Workflow Details */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>{currentWorkflow.name}</span>
                  <Badge variant={currentWorkflow.isActive ? "default" : "outline"}>
                    {currentWorkflow.isActive ? "Active" : "Paused"}
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleWorkflow(selectedWorkflow)}
                >
                  {currentWorkflow.isActive ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{currentWorkflow.description}</p>
            </CardHeader>
            <CardContent>
              {/* Workflow Performance */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-xl font-bold text-blue-500">{currentWorkflow.performance.leadsGenerated}</div>
                  <div className="text-xs text-muted-foreground">Leads Generated</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-xl font-bold text-green-500">{currentWorkflow.performance.conversionRate}%</div>
                  <div className="text-xs text-muted-foreground">Conversion Rate</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-xl font-bold text-purple-500">{currentWorkflow.performance.avgResponseTime}</div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-xl font-bold text-yellow-500">{currentWorkflow.performance.satisfactionScore}</div>
                  <div className="text-xs text-muted-foreground">Satisfaction</div>
                </div>
              </div>

              {/* AI Workflow Steps */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>AI Workflow Steps</span>
                </h4>
                
                <div className="space-y-3">
                  {currentWorkflow.steps.map((step, index) => (
                    <Card key={step.id} className="border-primary/10">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <div className="p-2 bg-gradient-primary rounded-full">
                                <Bot className="h-5 w-5 text-primary-foreground" />
                              </div>
                              {index < currentWorkflow.steps.length - 1 && (
                                <div className="absolute left-4 top-12 w-px h-6 bg-primary/20"></div>
                              )}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div>
                                <h5 className="font-medium">{step.name}</h5>
                                <Badge variant="outline" className="text-xs">
                                  {step.type.replace('_', ' ')}
                                </Badge>
                              </div>
                              
                              {/* Step Configuration */}
                              <div className="space-y-2">
                                {step.config.modelType && (
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-gradient-primary text-primary-foreground text-xs">
                                      {step.config.modelType.toUpperCase()}
                                    </Badge>
                                    {step.config.learning && (
                                      <Badge variant="outline" className="text-xs">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Learning Enabled
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                
                                {step.config.prompt && (
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <Label className="text-xs text-muted-foreground">AI Prompt</Label>
                                    <p className="text-sm mt-1">{step.config.prompt}</p>
                                  </div>
                                )}
                                
                                {step.config.threshold && (
                                  <div className="flex items-center space-x-2">
                                    <Label className="text-sm">Threshold:</Label>
                                    <Badge variant="outline">{step.config.threshold}</Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Learning Insights */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Learning Insights</span>
            <Badge className="bg-gradient-primary text-primary-foreground">
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-lg font-bold text-green-600">+23%</div>
                    <div className="text-sm text-green-700">Response Quality</div>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  AI improved response accuracy this week
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-lg font-bold text-blue-600">87%</div>
                    <div className="text-sm text-blue-700">Lead Accuracy</div>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  AI correctly identifies high-value leads
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-lg font-bold text-purple-600">156</div>
                    <div className="text-sm text-purple-700">Patterns Learned</div>
                  </div>
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  New behavioral patterns discovered
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
