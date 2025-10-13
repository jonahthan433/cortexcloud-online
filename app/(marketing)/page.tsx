'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  Zap,
  Globe,
  Users,
  Workflow,
  MessageSquare,
  Calendar,
  CreditCard,
  BarChart3,
  Monitor,
  BookOpen,
  Share2,
  Smartphone,
  Search,
  Crown,
  Settings,
  Target,
  ArrowRight,
  Star,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function LandingPage() {

  const features = [
    {
      icon: Users,
      title: 'CRM & Pipeline',
      description: 'Secure and organized client data with automated lead tracking and drag-and-drop pipeline management.',
      color: 'text-cyan-400',
    },
    {
      icon: Workflow,
      title: 'Automation Builder',
      description: 'Create powerful 24/7 marketing workflows to convert prospects into clients automatically.',
      color: 'text-purple-400',
    },
    {
      icon: MessageSquare,
      title: 'All-In-One Conversations',
      description: 'Manage communications across email, WhatsApp, social media DMs, and Slack from a single dashboard.',
      color: 'text-blue-400',
    },
    {
      icon: Monitor,
      title: 'Website Builder',
      description: 'Build professional websites with drag-and-drop functionality and mobile-responsive design.',
      color: 'text-green-400',
    },
    {
      icon: BookOpen,
      title: 'Course Builder',
      description: 'Create and sell online courses with integrated payment processing and student management.',
      color: 'text-yellow-400',
    },
    {
      icon: Calendar,
      title: 'Calendar Management',
      description: 'Seamless appointment booking with Google Calendar integration and automated reminders.',
      color: 'text-pink-400',
    },
    {
      icon: Share2,
      title: 'Social Media Scheduler',
      description: 'Automate content scheduling across all platforms to grow your audience consistently.',
      color: 'text-indigo-400',
    },
    {
      icon: Smartphone,
      title: 'WhatsApp & Slack Integration',
      description: 'Connect with customers through their preferred communication channels seamlessly.',
      color: 'text-teal-400',
    },
    {
      icon: Search,
      title: 'Automatic SEO Optimization',
      description: 'Built-in SEO tools to improve your website\'s search engine rankings automatically.',
      color: 'text-orange-400',
    },
    {
      icon: Crown,
      title: 'Affiliate Program Management',
      description: 'Create and manage affiliate programs to scale your business through partnerships.',
      color: 'text-red-400',
    },
    {
      icon: Settings,
      title: 'Memberships & Community',
      description: 'Build exclusive communities and membership sites with gated content and member management.',
      color: 'text-violet-400',
    },
    {
      icon: Target,
      title: 'Lead Intake Automations',
      description: 'Automatically capture, qualify, and distribute leads to the right team members.',
      color: 'text-emerald-400',
    },
  ];

  const capabilities = [
    {
      icon: Globe,
      title: 'Smart Website Builder',
      description: 'Create SEO-optimized landing pages with drag-and-drop ease. Built-in lead capture forms that convert visitors into customers.',
    },
    {
      icon: Users,
      title: 'Advanced CRM',
      description: 'Manage contacts, track interactions, and visualize your sales pipeline. Drag-and-drop deals through customizable stages.',
    },
    {
      icon: Workflow,
      title: 'Automation Workflows',
      description: 'Set up triggers and actions to automate repetitive tasks. From lead nurturing to follow-up sequences, let AI handle the routine.',
    },
    {
      icon: MessageSquare,
      title: 'Multi-Channel Communication',
      description: 'Unified inbox for email, WhatsApp, SMS, and social media. Respond to all messages from one central dashboard.',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Integrated appointment booking with Google Calendar sync. Automated reminders and follow-ups for better show-up rates.',
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Accept payments instantly with Stripe and PayPal integration. Create invoices, track payments, and automate billing.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Real-time dashboards showing lead generation, conversion rates, revenue trends, and team performance metrics.',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Access your business from anywhere with our PWA. Full functionality on desktop, tablet, and mobile devices.',
    },
    {
      icon: Zap,
      title: 'API Integrations',
      description: 'Connect with 1000+ apps and services. Sync data across your favorite tools and create seamless workflows.',
    },
  ];

  const testimonials = [
    {
      name: 'Emma J.',
      role: 'Retail Business Owner',
      company: 'Local Retail Store',
      content: 'As a small business owner, I was drowning in admin work until I started using this software. It streamlined my operations so seamlessly that I now have more time to focus on growth. It is a game-changer for efficiency!',
      rating: 5,
      avatar: 'EJ',
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Director',
      company: 'TechStart Inc',
      content: 'The automation workflows and CRM integration have transformed our lead generation process. We have seen a 300% increase in qualified leads and our sales team is finally organized.',
      rating: 5,
      avatar: 'MC',
    },
    {
      name: 'Sarah Rodriguez',
      role: 'Business Owner',
      company: 'Digital Solutions Co',
      content: 'The WhatsApp integration and social media scheduler alone have revolutionized how we communicate with clients. The 24/7 automation saves us 20+ hours per week.',
      rating: 5,
      avatar: 'SR',
    },
  ];

  const faqs = [
    {
      question: 'What is CortexCloud and how does it work?',
      answer: 'CortexCloud is an all-in-one business growth platform that combines CRM, marketing automation, communication tools, and analytics. It works by centralizing all your business processes into one intuitive dashboard, allowing you to capture leads, nurture them through automated workflows, and convert them into customers.',
    },
    {
      question: 'Do I need technical skills to use CortexCloud?',
      answer: 'Not at all! CortexCloud is designed for business owners and teams without technical backgrounds. Our drag-and-drop interface, pre-built templates, and guided setup make it easy to get started. Most users are up and running within minutes.',
    },
    {
      question: 'Can I integrate CortexCloud with my existing tools?',
      answer: 'Yes! CortexCloud integrates with 1000+ popular business tools including Google Workspace, Microsoft 365, Shopify, WordPress, Zapier, and many more. Our API also allows custom integrations for specific business needs.',
    },
    {
      question: 'What communication channels does CortexCloud support?',
      answer: 'CortexCloud supports email, WhatsApp Business, SMS, Facebook Messenger, Instagram DMs, and more. All messages appear in one unified inbox, making it easy to manage all customer communications from a single place.',
    },
    {
      question: 'Is my data secure with CortexCloud?',
      answer: 'Absolutely. We use enterprise-grade security including SSL encryption, regular security audits, GDPR compliance, and secure data centers. Your business data is protected with the same security standards used by major financial institutions.',
    },
    {
      question: 'Can I try CortexCloud before purchasing?',
      answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can explore all capabilities and see how CortexCloud fits your business needs before making any commitment.',
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We provide 24/7 customer support via live chat, email, and phone. Plus, you get access to our knowledge base, video tutorials, webinars, and a dedicated customer success manager for higher-tier plans.',
    },
    {
      question: 'Can I customize workflows and automation?',
      answer: 'Definitely! CortexCloud offers powerful workflow automation with conditional logic, triggers, and actions. You can create custom automation for lead nurturing, follow-ups, appointment scheduling, payment processing, and much more.',
    },
    {
      question: 'Is CortexCloud suitable for teams?',
      answer: 'Yes! CortexCloud supports team collaboration with user roles, permissions, shared pipelines, and team analytics. You can assign leads, track team performance, and ensure everyone stays aligned on your business goals.',
    },
    {
      question: 'What happens if I need to cancel my subscription?',
      answer: 'You can cancel anytime with no long-term contracts. Your data remains accessible during your billing period, and we provide easy data export options. We also offer a 30-day money-back guarantee if you are not satisfied.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 glass-effect px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8 border border-primary/20">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse-glow" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                AI-Powered Business Automation
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight px-2">
              <span className="gradient-text">CORTEX</span>
              <span className="text-foreground">CLOUD</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-2">
              The Ultimate All-in-One Business Growth Platform
            </p>

            <p className="text-base sm:text-lg text-muted-foreground/80 mb-8 sm:mb-12 max-w-2xl mx-auto px-2 leading-relaxed">
              Transform your business with 24/7 automation, comprehensive CRM, website building, course creation, and unified communications. Everything you need to scale your business.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16 px-4">
              <Button size="lg" className="glow w-full sm:w-auto touch-manipulation" asChild>
                <Link href="/pricing">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Start Free Trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground px-4">
              <div className="flex items-center space-x-1 sm:space-x-2 glass-effect px-3 sm:px-4 py-2 rounded-full border border-white/10">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span>Smart Automation</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 glass-effect px-3 sm:px-4 py-2 rounded-full border border-white/10">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span>Global Integration</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 glass-effect px-3 sm:px-4 py-2 rounded-full border border-white/10">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <p className="text-lg sm:text-xl font-semibold text-muted-foreground">
            ✨ Trusted by 10,000+ businesses worldwide
          </p>
        </div>
      </section>

      {/* Features Section */}
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
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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

      {/* Platform Capabilities Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 gradient-text leading-tight">
              Everything Your Business Needs to Grow
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
              CortexCloud combines all essential business tools into one powerful platform. From lead generation to customer management, automation to analytics – we have got you covered.
            </p>
            <Button variant="secondary" size="lg" className="animate-pulse-glow" asChild>
              <Link href="/pricing">Start Your Free Trial</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {capabilities.map((capability, index) => (
              <Card
                key={index}
                className="bg-card/30 border-cortex-cyan/10 hover:border-cortex-cyan/30 transition-all duration-300 group"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:glow transition-all duration-300">
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

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">
              Trusted by Growing Businesses
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              See how CortexCloud is helping businesses automate their growth and scale efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card/50 border-cortex-cyan/20 hover:border-cortex-cyan/40 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-cortex-cyan text-cortex-cyan" />
                    ))}
                  </div>

                  <p className="text-foreground mb-6 leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 gradient-text leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Everything you need to know about CortexCloud. Cannot find what you are looking for?{' '}
              <Link href="/contact" className="text-cortex-cyan hover:underline cursor-pointer ml-1">
                Contact our support team
              </Link>
              .
            </p>
          </div>

          <div className="bg-card/30 rounded-2xl border border-cortex-cyan/10 p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-cortex-cyan/10"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-cortex-cyan transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions? We are here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-primary hover:opacity-90" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" className="border-cortex-cyan/30 text-cortex-cyan hover:bg-cortex-cyan/10" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses automating their growth with CortexCloud. Start your free 14-day trial today – no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/pricing">
                <Zap className="h-5 w-5 mr-2" />
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/contact">
                <ArrowRight className="h-5 w-5 mr-2" />
                Talk to Sales
              </Link>
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
