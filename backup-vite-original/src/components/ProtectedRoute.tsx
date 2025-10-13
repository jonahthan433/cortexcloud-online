import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireTrial?: boolean;
}

export const ProtectedRoute = ({ children, requireTrial = true }: ProtectedRouteProps) => {
  const { user, loading, trialStatus } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Trial requirement checks
  if (requireTrial) {
    // Trial not started
    if (!user.trial_started) {
      return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
          <Card className="glass-effect border-primary/20 max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Start Your Free Trial</CardTitle>
              <p className="text-muted-foreground">
                You need to start your free trial to access the dashboard.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Welcome, {user.name || user.email}! Start your 14-day free trial to access all features.
                </p>
              </div>
              <Button className="w-full" asChild>
                <a href="/#pricing">Start Free Trial</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Trial expired
    if (trialStatus?.status === 'expired') {
      return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
          <Card className="glass-effect border-primary/20 max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl">Trial Expired</CardTitle>
              <p className="text-muted-foreground">
                Your free trial period has ended.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Thank you for trying CortexCloud! To continue using all features,
                  please upgrade to a paid plan.
                </p>
              </div>
              <Button className="w-full" asChild>
                <a href="/checkout">Upgrade Now</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
};
