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
  Brain,
  Monitor,
  BookOpen,
  Share2,
  Smartphone,
  Search,
  Crown,
  Settings,
  Target
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "CRM & Pipeline",
      description: "Secure and organized client data with automated lead tracking and drag-and-drop pipeline management.",
      color: "text-cyan-400"
    },
    {
      icon: Workflow,
      title: "Automation Builder",
      description: "Create powerful 24/7 marketing workflows to convert prospects into clients automatically.",
      color: "text-purple-400"
    },
    {
      icon: MessageSquare,
      title: "All-In-One Conversations",
      description: "Manage communications across email, WhatsApp, social media DMs, and Slack from a single dashboard.",
      color: "text-blue-400"
    },
    {
      icon: Monitor,
      title: "Website Builder",
      description: "Build professional websites with drag-and-drop functionality and mobile-responsive design.",
      color: "text-green-400"
    },
    {
      icon: BookOpen,
      title: "Course Builder",
      description: "Create and sell online courses with integrated payment processing and student management.",
      color: "text-yellow-400"
    },
    {
      icon: Calendar,
      title: "Calendar Management",
      description: "Seamless appointment booking with Google Calendar integration and automated reminders.",
      color: "text-pink-400"
    },
    {
      icon: Share2,
      title: "Social Media Scheduler",
      description: "Automate content scheduling across all platforms to grow your audience consistently.",
      color: "text-indigo-400"
    },
    {
      icon: Smartphone,
      title: "WhatsApp & Slack Integration",
      description: "Connect with customers through their preferred communication channels seamlessly.",
      color: "text-teal-400"
    },
    {
      icon: Search,
      title: "Automatic SEO Optimization",
      description: "Built-in SEO tools to improve your website's search engine rankings automatically.",
      color: "text-orange-400"
    },
    {
      icon: Crown,
      title: "Affiliate Program Management",
      description: "Create and manage affiliate programs to scale your business through partnerships.",
      color: "text-red-400"
    },
    {
      icon: Settings,
      title: "Memberships & Community",
      description: "Build exclusive communities and membership sites with gated content and member management.",
      color: "text-violet-400"
    },
    {
      icon: Target,
      title: "Lead Intake Automations",
      description: "Automatically capture, qualify, and distribute leads to the right team members.",
      color: "text-emerald-400"
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Everything you need to grow your business, automate workflows, and scale with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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