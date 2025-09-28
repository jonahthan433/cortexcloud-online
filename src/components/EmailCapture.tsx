import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { startTrial } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Save email to database
      const { data: emailData, error: emailError } = await supabase
        .from('email_leads')
        .insert({
          email: email,
          source: 'hero_section',
          status: 'pending'
        })
        .select()
        .single();

      if (emailError) throw emailError;

      // Send welcome email
      try {
        const { error: emailSendError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: email,
            lead_id: emailData.id
          }
        });

        if (emailSendError) {
          console.error('Email sending failed:', emailSendError);
          // Don't fail the signup if email fails
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the signup if email fails
      }

      // Update status to sent
      await supabase
        .from('email_leads')
        .update({ status: 'sent' })
        .eq('id', emailData.id);

      // Start trial for the user
      const trialResult = await startTrial(email);
      if (trialResult.success) {
        setSubmitted(true);
        toast({
          title: "Welcome to Cortex Cloud!",
          description: "Your 14-day free trial has started. Check your email for next steps.",
        });
      } else {
        setSubmitted(true);
        toast({
          title: "Welcome to Cortex Cloud!",
          description: "Check your email for exclusive benefits and next steps.",
        });
      }

    } catch (error) {
      console.error('Error saving email:', error);
      toast({
        title: "Error",
        description: "Failed to sign up. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-lg border border-primary/20">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-sm font-medium text-green-600">
          Welcome! Check your email for next steps.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 glass-effect p-1 rounded-lg border border-primary/20">
      <Input
        type="email"
        placeholder="Enter your business email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-[300px] bg-transparent border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
        required
      />
      <Button 
        type="submit" 
        variant="hero" 
        size="lg" 
        className="flex items-center space-x-2"
        disabled={loading}
      >
        <span>{loading ? "Signing up..." : "Start Free"}</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

