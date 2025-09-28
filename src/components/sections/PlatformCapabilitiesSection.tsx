import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Users, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  BarChart3,
  Workflow,
  Globe,
  Smartphone
} from "lucide-react";

const capabilities = [
  {
    icon: Globe,
    title: "Smart Website Builder",
    description: "Create SEO-optimized landing pages with drag-and-drop ease. Built-in lead capture forms that convert visitors into customers."
  },
  {
    icon: Users,
    title: "Advanced CRM",
    description: "Manage contacts, track interactions, and visualize your sales pipeline. Drag-and-drop deals through customizable stages."
  },
  {
    icon: Workflow,
    title: "Automation Workflows",
    description: "Set up triggers and actions to automate repetitive tasks. From lead nurturing to follow-up sequences, let AI handle the routine."
  },
  {
    icon: MessageSquare,
    title: "Multi-Channel Communication",
    description: "Unified inbox for email, WhatsApp, SMS, and social media. Respond to all messages from one central dashboard."
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Integrated appointment booking with Google Calendar sync. Automated reminders and follow-ups for better show-up rates."
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description: "Accept payments instantly with Stripe and PayPal integration. Create invoices, track payments, and automate billing."
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Real-time dashboards showing lead generation, conversion rates, revenue trends, and team performance metrics."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Access your business from anywhere with our PWA. Full functionality on desktop, tablet, and mobile devices."
  },
  {
    icon: Zap,
    title: "API Integrations",
    description: "Connect with 1000+ apps and services. Sync data across your favorite tools and create seamless workflows."
  }
];

export const PlatformCapabilitiesSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Everything Your Business Needs to Grow
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            CortexCloud combines all essential business tools into one powerful platform. 
            From lead generation to customer management, automation to analytics – we've got you covered.
          </p>
          <Button variant="secondary" size="lg" className="animate-pulse-glow" asChild>
            <a href="#pricing">Start Your Free Trial</a>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <Card key={index} className="bg-card/30 border-cortex-cyan/10 hover:border-cortex-cyan/30 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow transition-all duration-300">
                  <capability.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">{capability.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  {capability.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};