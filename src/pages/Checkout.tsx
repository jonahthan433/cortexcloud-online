import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailService } from '@/services/emailService';
import cortexLogo from '@/assets/cortex-logo.jpg';

interface Plan {
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  description: string;
  features: string[];
  popular: boolean;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  company: string;
  phone: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(true);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    company: '',
    phone: ''
  });

  const plans: Plan[] = [
    {
      name: "Initiate",
      price: isYearly ? "$157" : "$197",
      period: "/month",
      originalPrice: isYearly ? "$197" : undefined,
      description: "Perfect for businesses getting started with automation",
      features: [
        "Business Setup & Integration",
        "CRM & Pipeline Management",
        "Website Builder",
        "Course Builder",
        "Automation Builder",
        "All-In-One Conversations",
        "Task Management",
        "Calendar Management",
        "24/7 Support"
      ],
      popular: false
    },
    {
      name: "Elevate",
      price: isYearly ? "$237" : "$297",
      period: "/month",
      originalPrice: isYearly ? "$297" : undefined,
      description: "For growing businesses that need advanced features",
      features: [
        "Everything in Initiate",
        "Unlimited Seats & Contacts",
        "AI-Automation Integration",
        "Lead Intake Automations",
        "Sales & Marketing Automations",
        "Website Integration & Hosting",
        "WhatsApp & Slack Integration",
        "Automatic SEO Optimization",
        "Affiliate Program & Management",
        "Memberships, Community & App Builder"
      ],
      popular: true
    },
    {
      name: "Innovate",
      price: "Custom",
      period: "Pricing",
      description: "Done For You service with agency features",
      features: [
        "Everything in Elevate",
        "Agency Automations",
        "Agency Sales & Marketing Drips",
        "Agency Lead Intake & Distribution",
        "Agency Qualifying Forms & Surveys",
        "Agency Calendar Setup",
        "Access to Resellers License",
        "Dedicated Account Manager",
        "Custom Integrations",
        "White-label Options"
      ],
      popular: false
    }
  ];

  // Get selected plan from URL params or default to Elevate
  const selectedPlanName = new URLSearchParams(location.search).get('plan') || 'Elevate';
  const selectedPlan = plans.find(plan => plan.name === selectedPlanName) || plans[1];

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.company.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your company name",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleStartTrial = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Save user information and create trial account
      const { data: userData, error: userError } = await supabase
        .from('email_leads')
        .insert({
          email: formData.email,
          source: 'checkout_trial',
          status: 'trial_started'
        })
        .select()
        .single();

      if (userError && userError.code !== '23505') { // Ignore duplicate email error
        throw userError;
      }

      // Create user record for trial
      const { data: trialUser, error: trialError } = await supabase
        .from('users')
        .upsert({
          email: formData.email,
          name: formData.fullName,
          company: formData.company,
          trial_started: true,
          trial_expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          plan: selectedPlan.name.toLowerCase()
        })
        .select()
        .single();

      if (trialError) {
        console.error('Error creating trial user:', trialError);
      }

      // Send activation email
      const emailResult = await EmailService.sendActivationEmail(
        formData.email, 
        formData.fullName, 
        selectedPlan.name
      );

      if (emailResult.success) {
        toast({
          title: "Trial Started Successfully!",
          description: "Check your email for account activation instructions.",
        });
      } else {
        toast({
          title: "Trial Started",
          description: "Your trial has started. Please check your email for next steps.",
        });
      }

      // Redirect to success page
      navigate('/checkout/success', { 
        state: { 
          plan: selectedPlan.name,
          email: formData.email,
          userName: formData.fullName
        } 
      });

    } catch (error) {
      console.error('Error starting trial:', error);
      toast({
        title: "Error",
        description: "Failed to start trial. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  const getTotalPrice = () => {
    if (selectedPlan.name === 'Innovate') {
      return 'Contact Sales';
    }
    
    if (isYearly) {
      const monthlyPrice = parseInt(selectedPlan.price.replace('$', ''));
      return `$${(monthlyPrice * 12).toLocaleString()}`;
    }
    
    return selectedPlan.price;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src={cortexLogo} 
                  alt="CortexCloud" 
                  className="h-10 w-auto brightness-110 contrast-110"
                />
              </Link>
              <h1 className="text-2xl font-bold gradient-text">Start Your Free Trial</h1>
            </div>
            <Link to="/#pricing">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Plan Details */}
          <div className="space-y-6">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{selectedPlan.name} Plan</CardTitle>
                  {selectedPlan.popular && (
                    <Badge className="bg-primary/10 text-primary">Most Popular</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{selectedPlan.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold gradient-text">
                      {selectedPlan.price}
                    </span>
                    <span className="text-muted-foreground">{selectedPlan.period}</span>
                  </div>
                  
                  {selectedPlan.originalPrice && (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg text-muted-foreground line-through">
                        {selectedPlan.originalPrice}
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        Save 20%
                      </Badge>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">What's Included:</h3>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Toggle */}
            <Card className="glass-effect border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Monthly
                  </span>
                  <button
                    onClick={() => setIsYearly(!isYearly)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isYearly ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isYearly ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Yearly
                    </span>
                    <Badge className="bg-primary/10 text-primary text-xs">
                      Save 20%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="space-y-6">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle>Start Your Free Trial</CardTitle>
                <p className="text-muted-foreground">
                  Enter your details to begin your 14-day free trial
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your Company"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold gradient-text">
                      {getTotalPrice()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-6">
                    <p>• 14-day free trial, no credit card required</p>
                    <p>• Cancel anytime during the trial period</p>
                    <p>• Full access to all {selectedPlan.name} features</p>
                  </div>

                  <Button
                    onClick={handleStartTrial}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Starting Trial...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Start Free Trial
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Secure & encrypted checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
