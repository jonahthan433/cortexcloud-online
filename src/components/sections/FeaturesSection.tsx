import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Workflow, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  BarChart3,
  Zap,
  Globe,
  Brain
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Smart CRM",
      description: "Advanced contact management with AI-powered insights and drag-and-drop pipeline stages.",
      color: "text-cyan-400"
    },
    {
      icon: Workflow,
      title: "Automation Engine",
      description: "Create powerful workflows with triggers, actions, and conditional logic to automate your business.",
      color: "text-purple-400"
    },
    {
      icon: MessageSquare,
      title: "Unified Communications",
      description: "Manage email, WhatsApp, SMS, and social media messages from a single intelligent inbox.",
      color: "text-blue-400"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Seamless appointment booking with Google Calendar integration and automated reminders.",
      color: "text-green-400"
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Accept payments effortlessly with Stripe and PayPal integration built right in.",
      color: "text-yellow-400"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights into leads, conversions, revenue, and business performance metrics.",
      color: "text-pink-400"
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Intelligent recommendations and automated decision-making to optimize your workflows.",
      color: "text-indigo-400"
    },
    {
      icon: Globe,
      title: "Global Integration",
      description: "Connect with 1000+ apps and services to create a unified business ecosystem.",
      color: "text-teal-400"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed and scalability with enterprise-grade performance and reliability.",
      color: "text-orange-400"
    }
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to grow your business, automate workflows, and scale with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="glass-effect border-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-glow group"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}