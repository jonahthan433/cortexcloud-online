import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock, Users, Zap } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";

interface FeatureGateProps {
  children: ReactNode;
  feature: string;
  requiredPlan: 'elevate' | 'custom';
  currentPlan?: 'initiate' | 'elevate' | 'custom';
  upgradeMessage?: string;
  className?: string;
}

export const FeatureGate = ({ 
  children, 
  feature, 
  requiredPlan, 
  upgradeMessage,
  className = "" 
}: FeatureGateProps) => {
  const { currentPlan, upgradePrompt } = usePlan();

  const getPlanPriority = (plan: 'initiate' | 'elevate' | 'custom') => {
    switch (plan) {
      case 'initiate': return 1;
      case 'elevate': return 2;
      case 'custom': return 3;
      default: return 1;
    }
  };

  const currentPriority = getPlanPriority(currentPlan);
  const requiredPriority = getPlanPriority(requiredPlan);

  const hasAccess = currentPriority >= requiredPriority;

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show upgrade prompt
  return (
    <Card className={`glass-effect border-primary/20 relative overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="relative">
          {/* Blurred background content */}
          <div className="blur-sm opacity-50">
            {children}
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-primary rounded-full">
                  <Crown className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold gradient-text">
                  Upgrade Required
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {upgradeMessage || `This feature "${feature}" requires a ${requiredPlan} plan or higher.`}
                </p>
              </div>
              
              <div className="space-y-3">
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  {requiredPlan.toUpperCase()} PLAN FEATURE
                </Badge>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => upgradePrompt(feature)}
                    className="w-full"
                    variant="hero"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => upgradePrompt("View Pricing Plans")}
                  >
                    View All Plans
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PlanBadgeProps {
  plan: 'initiate' | 'elevate' | 'custom';
  className?: string;
}

export const PlanBadge = ({ plan, className = "" }: PlanBadgeProps) => {
  const { currentPlan } = usePlan();
  
  const getPlanConfig = (planType: 'initiate' | 'elevate' | 'custom') => {
    switch (planType) {
      case 'initiate':
        return {
          label: 'Initiate',
          icon: Users,
          className: 'bg-blue-100 text-blue-800'
        };
      case 'elevate':
        return {
          label: 'Elevate',
          icon: Zap,
          className: 'bg-purple-100 text-purple-800'
        };
      case 'custom':
        return {
          label: 'Custom',
          icon: Crown,
          className: 'bg-gradient-primary text-primary-foreground'
        };
    }
  };

  const isCurrentPlan = currentPlan === plan;
  const config = getPlanConfig(plan);

  return (
    <Badge 
      variant="outline" 
      className={`text-xs ${config.className} ${className}`}
    >
      <config.icon className="h-3 w-3 mr-1" />
      {config.label}
      {isCurrentPlan && ' • Current'}
    </Badge>
  );
};
