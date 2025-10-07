import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash/query parameters
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication Failed",
            description: error.message || "Unable to complete sign-in",
            variant: "destructive"
          });
          navigate('/auth/login');
          return;
        }

        if (data.session?.user) {
          // User successfully signed in - AuthContext will handle this automatically
          toast({
            title: "Sign-In Successful",
            description: `Welcome ${data.session.user.email}!`,
          });
          
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          // No session found
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred during sign-in",
          variant: "destructive"
        });
        navigate('/auth/login');
      }
    };

    // Handle the OAuth callback
    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="glass-effect border-primary/20 w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl gradient-text">Signing You In</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">
            Please wait while we complete your sign-in...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
