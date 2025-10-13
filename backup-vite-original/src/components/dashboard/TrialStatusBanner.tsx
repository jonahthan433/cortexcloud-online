import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const TrialStatusBanner = () => {
  const { trialStatus, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (trialStatus?.status === 'active' && trialStatus.daysRemaining !== undefined) {
      const daysProgress = (trialStatus.daysRemaining / 14) * 100;
      setProgress(Math.max(0, Math.min(100, daysProgress)));
    }
  }, [trialStatus]);

  if (!trialStatus || !user) return null;

  const handleUpgradeClick = () => {
    navigate('/checkout');
  };

  const renderBannerContent = () => {
    switch (trialStatus.status) {
      case 'not_started':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertCircle className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="text-sm font-medium">Trial Not Started</h3>
                <p className="text-sm text-muted-foreground">
                  Start your 14-day free trial to access all features
                </p>
              </div>
            </div>
            <Button onClick={handleUpgradeClick} size="sm">
              Start Trial
            </Button>
          </div>
        );

      case 'active':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Clock className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="text-sm font-medium">Trial Active</h3>
                  <p className="text-sm text-muted-foreground">
                    {trialStatus.daysRemaining} days remaining in your trial
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                {Math.floor(progress)}% remaining
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-end">
              <Button onClick={handleUpgradeClick} size="sm" variant="outline">
                Upgrade Now
              </Button>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="text-sm font-medium">Trial Expired</h3>
                <p className="text-sm text-muted-foreground">
                  Your trial period has ended. Upgrade now to continue using all features.
                </p>
              </div>
            </div>
            <Button onClick={handleUpgradeClick} size="sm" variant="destructive">
              Upgrade Now
            </Button>
          </div>
        );

      case 'subscribed':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="text-sm font-medium">Full Access</h3>
                <p className="text-sm text-muted-foreground">
                  You have full access to all features
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-500">
              Active Subscription
            </Badge>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mb-6 glass-effect border-primary/20">
      <CardContent className="p-6">
        {renderBannerContent()}
      </CardContent>
    </Card>
  );
};