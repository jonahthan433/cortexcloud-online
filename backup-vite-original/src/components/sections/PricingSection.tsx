import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
        {
          name: "Initiate",
          price: isYearly ? "$191.99" : "$19.99",
          period: isYearly ? "/year" : "/month",
          originalPrice: isYearly ? "$239.88" : null,
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
      popular: false,
      ctaText: "Start Free Trial"
    },
        {
          name: "Elevate",
          price: isYearly ? "$479.99" : "$49.99",
          period: isYearly ? "/year" : "/month",
          originalPrice: isYearly ? "$599.88" : null,
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
      popular: true,
      ctaText: "Start Free Trial"
    },
        {
          name: "Innovate",
          price: "Custom",
          period: "Pricing",
          originalPrice: null,
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
      popular: false,
      ctaText: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="gradient-text">Simple Pricing</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
                Choose the perfect plan for your business. All plans include a 14-day free trial.
              </p>
              
              {/* Pricing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
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
                  <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Yearly
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                    Save 20%
                  </span>
                </div>
              </div>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
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
                      <div className="text-center">
                        {plan.originalPrice && (
                          <div className="text-lg text-muted-foreground line-through mb-1">
                            {plan.originalPrice}
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="text-5xl font-bold gradient-text">
                            {plan.price}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {plan.period}
                          </span>
                        </div>
                        {plan.name !== "Innovate" && (
                          <div className="text-sm text-primary font-medium mt-1">
                            {isYearly ? "Billed annually" : "Billed monthly"}
                          </div>
                        )}
                      </div>
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
                
                    {plan.name === "Innovate" ? (
                      <Button
                        variant={plan.popular ? "hero" : "cyber"}
                        className="w-full mt-8"
                        size="lg"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        {plan.ctaText}
                      </Button>
                    ) : (
                      <Button
                        variant={plan.popular ? "hero" : "cyber"}
                        className="w-full mt-8"
                        size="lg"
                        asChild
                      >
                        <Link to={`/checkout?plan=${plan.name}&yearly=${isYearly}`}>
                          <Zap className="h-4 w-4 mr-2" />
                          {plan.ctaText}
                        </Link>
                      </Button>
                    )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}