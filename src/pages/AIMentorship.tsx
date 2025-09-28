import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import cortexLogo from '@/assets/cortex-logo.jpg';

const AIMentorship = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    experience: '',
    goal: '',
    success: '',
    challenge: '',
    timeCommitment: '',
    readiness: '',
    budget: '',
    startTime: '',
    whyRight: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      id: 'name',
      question: "What's your name?",
      type: 'text',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      id: 'email',
      question: "What's your email address?",
      type: 'email',
      placeholder: 'Enter your email',
      required: true
    },
    {
      id: 'phone',
      question: "What's your phone number? (optional)",
      type: 'tel',
      placeholder: 'Enter your phone number',
      required: false
    },
    {
      id: 'role',
      question: "What best describes you right now?",
      type: 'radio',
      options: [
        "Entrepreneur / Business Owner",
        "Freelancer / Consultant", 
        "Working in a company (employee/manager)",
        "Student / Exploring opportunities",
        "Other"
      ],
      required: true
    },
    {
      id: 'experience',
      question: "What's your current experience with AI & automation?",
      type: 'radio',
      options: [
        "Beginner (no experience, just getting started)",
        "Intermediate (I've experimented with tools like ChatGPT, n8n, Zapier, etc.)",
        "Advanced (I'm already building systems/using AI in my work or business)"
      ],
      required: true
    },
    {
      id: 'goal',
      question: "What's your #1 goal with AI mentorship?",
      type: 'radio',
      options: [
        "Scale my business with AI systems",
        "Start an AI/automation agency or side hustle",
        "Learn AI to grow my career/job opportunities",
        "Automate repetitive tasks to save time",
        "Other"
      ],
      required: true
    },
    {
      id: 'success',
      question: "What would success in this mentorship look like for you?",
      type: 'radio',
      options: [
        "Generating more income/revenue using AI",
        "Building an AI skillset I can monetize",
        "Having working systems running in my business",
        "Getting clarity and a roadmap to follow",
        "Other"
      ],
      required: true
    },
    {
      id: 'challenge',
      question: "What's your biggest challenge with AI right now?",
      type: 'radio',
      options: [
        "Not knowing where to start",
        "Too many tools, not sure what's best",
        "Lack of time to learn/implement",
        "Struggling to connect AI to real business results",
        "Other"
      ],
      required: true
    },
    {
      id: 'timeCommitment',
      question: "How much time can you dedicate per week to mentorship & implementation?",
      type: 'radio',
      options: [
        "Less than 3 hours",
        "3–5 hours",
        "5–10 hours",
        "10+ hours"
      ],
      required: true
    },
    {
      id: 'readiness',
      question: "How ready are you to take action and apply what you learn?",
      type: 'radio',
      options: [
        "Very ready – I want to start immediately",
        "Ready, but need some structure and accountability",
        "Interested, but still exploring"
      ],
      required: true
    },
    {
      id: 'budget',
      question: "Have you set aside a budget for mentorship?",
      type: 'radio',
      options: [
        "Yes, I have funds ready to invest",
        "I'm not sure, but I can make it work if it's the right fit",
        "Not right now, I'm just exploring free resources"
      ],
      required: true
    },
    {
      id: 'startTime',
      question: "If accepted, when would you be ready to start?",
      type: 'radio',
      options: [
        "Right away (within 1–2 weeks)",
        "Within 1 month",
        "In 2–3 months",
        "Not sure yet"
      ],
      required: true
    },
    {
      id: 'whyRight',
      question: "Why do you think this mentorship is right for you?",
      type: 'radio',
      options: [
        "I'm ready to take action and need guidance",
        "I want to avoid wasting time figuring it out alone",
        "I know AI is the future and I don't want to be left behind",
        "I want a proven roadmap instead of trial-and-error",
        "Other"
      ],
      required: true
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (value: string) => {
    const currentStepData = steps[currentStep];
    setFormData(prev => ({ ...prev, [currentStepData.id]: value }));
    
    // Auto-advance to next step after selection (faster on mobile)
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  const isCurrentStepValid = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData.required) return true;
    return formData[currentStepData.id as keyof typeof formData] !== '';
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        console.warn('Supabase not configured, simulating form submission');
        // Simulate successful submission
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Save consultation request to database
        const { data, error } = await supabase
          .from('consultation_requests')
          .insert([
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              role: formData.role,
              experience: formData.experience,
              goal: formData.goal,
              success: formData.success,
              challenge: formData.challenge,
              time_commitment: formData.timeCommitment,
              readiness: formData.readiness,
              budget: formData.budget,
              start_time: formData.startTime,
              why_right: formData.whyRight,
              status: 'pending',
              created_at: new Date().toISOString()
            }
          ]);

        if (error) {
          throw error;
        }
      }
      
      // Move to completion step
      setCurrentStep(steps.length);
      
      toast({
        title: "Consultation Request Submitted!",
        description: "We'll review your application and contact you within 24 hours to schedule your free consultation.",
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: '',
          experience: '',
          goal: '',
          success: '',
          challenge: '',
          timeCommitment: '',
          readiness: '',
          budget: '',
          startTime: '',
          whyRight: ''
        });
        setCurrentStep(0);
      }, 5000);
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: "Error",
        description: "Failed to submit consultation request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img 
                src={cortexLogo} 
                alt="CortexCloud" 
                className="h-8 sm:h-10 w-auto brightness-110 contrast-110"
              />
              <h1 className="text-lg sm:text-2xl font-bold gradient-text">AI Mentorship</h1>
            </div>
            <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
              <a href="/">← Back</a>
            </Button>
          </div>
        </div>
      </div>


      {/* Schedule Demo Form */}
      <section id="schedule-demo" className="py-8 sm:py-12 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="gradient-text">Schedule Your Free 30-Minute 1-1 Consultation</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
                Let's discuss your AI goals and create a custom strategy for your business
              </p>
            </div>

            <Card className="glass-effect border-primary/20 w-full mx-auto">
              <CardHeader className="px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-2 sm:space-y-0">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                  <div className="w-full sm:w-auto sm:flex-1 bg-gray-200 rounded-full h-2 sm:ml-4">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
                {currentStep < steps.length ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="text-center px-2">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-3 sm:mb-4 leading-tight">
                        {steps[currentStep].question}
                      </h3>
                    </div>

                    {steps[currentStep].type === 'text' || steps[currentStep].type === 'email' || steps[currentStep].type === 'tel' ? (
                      <div className="space-y-4">
                        <Input
                          type={steps[currentStep].type}
                          placeholder={steps[currentStep].placeholder}
                          value={formData[steps[currentStep].id as keyof typeof formData] as string}
                          onChange={(e) => handleInputChange(steps[currentStep].id, e.target.value)}
                          className="bg-background/50 border-primary/20 focus:border-primary text-center text-base sm:text-lg py-3 sm:py-4 w-full"
                          style={{ fontSize: '16px' }} // Prevents zoom on iOS
                          autoFocus
                        />
                        <div className="flex justify-center">
                          <Button
                            onClick={handleNext}
                            disabled={!isCurrentStepValid()}
                            className="bg-primary hover:bg-primary/90 w-full sm:w-auto px-6 py-2 sm:py-3 text-sm sm:text-base"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {steps[currentStep].options?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all duration-200 hover:border-primary/50 touch-manipulation ${
                              formData[steps[currentStep].id as keyof typeof formData] === option
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-foreground text-sm sm:text-base leading-relaxed">{option}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-center pt-4 space-y-3 sm:space-y-0">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className="flex items-center w-full sm:w-auto order-2 sm:order-1"
                      >
                        ← Previous
                      </Button>
                      
                      {currentStep === steps.length - 1 && (
                        <Button
                          onClick={handleSubmit}
                          disabled={loading || !isCurrentStepValid()}
                          className="bg-primary hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Calendar className="h-4 w-4 mr-2" />
                              Submit Request
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 px-2">
                    <div className="text-4xl sm:text-6xl">🎉</div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                      Thank you!
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      We'll review your application and contact you within 24 hours.
                    </p>
                  </div>
                )}

                <div className="text-center text-xs sm:text-sm text-muted-foreground px-2">
                  <p>
                    By submitting this form, you agree to our{' '}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIMentorship;
