import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  BookOpen,
  Award,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIMentorship = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Demo Request Submitted!",
        description: "We'll contact you within 24 hours to schedule your AI mentorship demo.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit demo request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const mentorshipFeatures = [
    {
      icon: Brain,
      title: "AI Strategy Development",
      description: "Learn how to implement AI solutions that drive real business results",
      color: "text-blue-500"
    },
    {
      icon: Target,
      title: "Custom AI Solutions",
      description: "Get personalized AI strategies tailored to your specific industry and goals",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "ROI Optimization",
      description: "Maximize your return on investment with proven AI implementation strategies",
      color: "text-purple-500"
    },
    {
      icon: MessageSquare,
      title: "1-on-1 Mentorship",
      description: "Direct access to AI experts for personalized guidance and support",
      color: "text-orange-500"
    },
    {
      icon: BookOpen,
      title: "Training Programs",
      description: "Comprehensive training to build your team's AI capabilities",
      color: "text-indigo-500"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Earn industry-recognized certifications in AI implementation",
      color: "text-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO",
      company: "TechStart Inc",
      content: "CortexCloud's AI mentorship transformed our business. We increased efficiency by 300% and reduced costs by 40%.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      company: "InnovateCorp",
      content: "The personalized approach and deep expertise helped us implement AI solutions that actually work for our business.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Operations Director",
      company: "GrowthCo",
      content: "Best investment we've made. The ROI was visible within the first month of implementation.",
      rating: 5,
      avatar: "EW"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$2,997",
      period: "one-time",
      description: "Perfect for small businesses getting started with AI",
      features: [
        "2-hour strategy session",
        "Custom AI roadmap",
        "30-day email support",
        "Implementation checklist",
        "Resource library access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$4,997",
      period: "one-time",
      description: "Comprehensive AI transformation for growing businesses",
      features: [
        "4-hour intensive session",
        "Custom AI solutions design",
        "90-day implementation support",
        "Team training session",
        "Monthly check-ins",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Full-scale AI transformation for large organizations",
      features: [
        "Unlimited sessions",
        "Custom AI architecture",
        "Dedicated AI consultant",
        "Team certification program",
        "Ongoing optimization",
        "White-label solutions"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/src/assets/cortex-logo.jpg" 
                alt="CortexCloud" 
                className="h-10 w-auto brightness-110 contrast-110"
              />
              <h1 className="text-2xl font-bold gradient-text">AI Mentorship Program</h1>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Business Transformation
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="gradient-text">Transform Your Business</span>
              <br />
              <span className="text-foreground">With AI Mentorship</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Get personalized guidance from AI experts to implement cutting-edge solutions 
              that drive real results for your business.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-12">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <a href="#schedule-demo">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Your Demo
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#pricing">
                  <Star className="h-5 w-5 mr-2" />
                  View Pricing
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">300%</div>
                <div className="text-muted-foreground">Average ROI Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Businesses Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24h</div>
                <div className="text-muted-foreground">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">What You'll Get</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive AI mentorship designed to transform your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorshipFeatures.map((feature, index) => (
              <Card key={index} className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Success Stories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how businesses like yours have transformed with our AI mentorship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-effect border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Choose Your Plan</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Select the mentorship package that best fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative glass-effect border-primary/20 transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'border-primary/40 shadow-glow scale-105'
                    : 'hover:border-primary/30 hover:shadow-glow'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary px-6 py-2 rounded-full text-sm font-semibold text-primary-foreground">
                      <Star className="h-4 w-4 mr-2" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>
                  <div className="flex items-center justify-center">
                    <span className="text-5xl font-bold gradient-text">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "hero" : "outline"}
                    className="w-full mt-8"
                    size="lg"
                    asChild
                  >
                    <a href="#schedule-demo">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Demo
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Demo Form */}
      <section id="schedule-demo" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Schedule Your Demo</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Get a personalized AI strategy session tailored to your business needs
              </p>
            </div>

            <Card className="glass-effect border-primary/20 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us about your AI goals</Label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="What would you like to achieve with AI? What challenges are you facing?"
                      className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-5 w-5 mr-2" />
                        Schedule Demo
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    We'll get back to you within 24 hours to schedule your AI mentorship session.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIMentorship;
