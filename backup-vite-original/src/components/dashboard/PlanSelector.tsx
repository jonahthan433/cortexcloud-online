import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlan, PlanType } from "@/contexts/PlanContext";
import { 
  Crown, 
  Zap, 
  Users, 
  Star,
  ChevronRight,
  CheckCircle
} from "lucide-react";

export const PlanSelector = () => {
  const { currentPlan, setCurrentPlan } = usePlan();
  const [showPlanModal, setShowPlanModal] = useState(false);

  const plans = [
    {
      id: 'initiate' as PlanType,
      name: 'Initiate',
      price: '$197',
      description: 'Perfect for businesses getting started',
      features: [
        'CRM & Pipeline Management',
        'Website Builder',
        'Course Builder', 
        'Basic Automations',
        'Task Management',
        'Calendar Management'
      ],
      icon: Users,
      popular: false,
      limits: 'Up to 500 contacts, 5 automations'
    },
    {
      id: 'elevate' as PlanType,
      name: 'Elevate',
      price: '$297',
      description: 'For growing businesses',
      features: [
        'Everything in Initiate',
        'AI-Automation Integration',
        'Unlimited Contacts',
        'Advanced Automations',
        'Affiliate Program',
        'WhatsApp & Slack Integration'
      ],
      icon: Zap,
      popular: true,
      limits: 'Unlimited contacts & automations'
    },
    {
      id: 'custom' as PlanType,
      name: 'Custom',
      price: 'Custom',
      description: 'Done For You service',
      features: [
        'Everything in Elevate',
        'Agency Features',
        'White-label Options',
        'Custom Integrations',
        'Dedicated Manager',
        'Resellers License'
      ],
      icon: Crown,
      popular: false,
      limits: 'Full agency capabilities'
    }
  ];

  const currentPlanData = plans.find(plan => plan.id === currentPlan);

  return (
    <div className="space-y-4">
      {/* Current Plan Display */}
      <Card className="glass-effect border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-primary/10`}>
                {currentPlanData && <currentPlanData.icon className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <CardTitle className="text-lg">{currentPlanData?.name} Plan</CardTitle>
                <p className="text-sm text-muted-foreground">{currentPlanData?.description}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Current
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Monthly Revenue:</span>
              <span className="font-medium">{currentPlanData?.price}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentPlanData?.limits}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPlanModal(!showPlanModal)}
              className="w-full"
            >
              {showPlanModal ? 'Hide Plans' : 'View All Plans'}
              <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${showPlanModal ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison Modal */}
      {showPlanModal && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">Choose Your Plan</h3>
            <p className="text-sm text-muted-foreground">Switch between plans to unlock more features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`glass-effect border-primary/20 transition-all duration-200 cursor-pointer hover:scale-105 ${
                  currentPlan === plan.id 
                    ? 'border-primary/40 shadow-glow' 
                    : currentPlanData?.popular 
                      ? 'hover:border-primary/30'
                      : 'hover:border-primary/20'
                }`}
                onClick={() => setCurrentPlan(plan.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-full bg-primary/10`}>
                      <plan.icon className="h-5 w-5 text-primary" />
                    </div>
                    {plan.popular && (
                      <Badge className="bg-gradient-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {currentPlan === plan.id && (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{plan.price}</div>
                      {plan.price !== 'Custom' && <div className="text-xs text-muted-foreground">per month</div>}
                    </div>
                    
                    <div className="space-y-1">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 4 && (
                        <div className="text-xs text-muted-foreground">+{plan.features.length - 4} more features</div>
                      )}
                    </div>
                    
                    <Button 
                      variant={currentPlan === plan.id ? "default" : "outline"}
                      className="w-full"
                      size="sm"
                    >
                      {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
