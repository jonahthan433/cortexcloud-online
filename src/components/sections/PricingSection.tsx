import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 1,000 contacts",
        "5 automation workflows",
        "Email integration",
        "Basic analytics",
        "24/7 support",
        "1 user account"
      ],
      popular: false,
      ctaText: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "For growing businesses that need more power",
      features: [
        "Up to 10,000 contacts",
        "Unlimited automation workflows",
        "Multi-channel communications",
        "Advanced analytics",
        "Calendar integration",
        "Payment processing",
        "Up to 5 user accounts",
        "Priority support"
      ],
      popular: true,
      ctaText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited contacts",
        "Advanced AI features",
        "White-label options",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced security",
        "Unlimited user accounts",
        "Custom workflows"
      ],
      popular: false,
      ctaText: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Simple Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative glass-effect border-primary/10 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-primary/40 shadow-glow scale-105' 
                  : 'hover:border-primary/30 hover:shadow-glow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary px-6 py-2 rounded-full text-sm font-semibold text-primary-foreground flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-6">
                  {plan.description}
                </CardDescription>
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
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "hero" : "cyber"} 
                  className="w-full mt-8"
                  size="lg"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {plan.ctaText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}