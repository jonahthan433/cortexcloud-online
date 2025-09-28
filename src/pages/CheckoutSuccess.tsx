import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, ArrowRight, Calendar, Zap } from 'lucide-react';

interface SuccessData {
  plan: string;
  email: string;
  userName: string;
}

const CheckoutSuccess = () => {
  const location = useLocation();
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [timeLeft, setTimeLeft] = useState(14 * 24 * 60 * 60); // 14 days in seconds

  useEffect(() => {
    if (location.state) {
      setSuccessData(location.state as SuccessData);
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (!successData) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Access</h1>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/src/assets/cortex-logo.jpg" 
              alt="CortexCloud" 
              className="h-10 w-auto brightness-110 contrast-110"
            />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Welcome to CortexCloud!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Your {successData.plan} trial has been started successfully
            </p>
            <p className="text-muted-foreground">
              We've sent activation instructions to <strong>{successData.email}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Trial Information */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Your Trial Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-semibold">{successData.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trial Duration:</span>
                  <span className="font-semibold">14 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Remaining:</span>
                  <span className="font-semibold text-green-600">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>Next Steps</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Check Your Email</p>
                    <p className="text-sm text-muted-foreground">
                      Look for the activation email in your inbox
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Activate Your Account</p>
                    <p className="text-sm text-muted-foreground">
                      Click the activation button in the email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Access Your Dashboard</p>
                    <p className="text-sm text-muted-foreground">
                      Start exploring all the features
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Instructions */}
          <Card className="glass-effect border-primary/20 mb-12">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>Activation Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 rounded-lg p-6">
                <p className="text-muted-foreground mb-4">
                  We've sent an activation email to <strong>{successData.email}</strong> with instructions to complete your account setup.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Check your spam folder if you don't see the email</p>
                  <p>• The activation link will expire in 24 hours</p>
                  <p>• Contact support if you need help</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/auth/register">
                <Button variant="hero" className="glow">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Complete Registration
                </Button>
              </Link>
              
              <Link to="/auth/login">
                <Button variant="outline">
                  Already Have Account? Sign In
                </Button>
              </Link>
            </div>
            
            <div className="pt-8">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                ← Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
