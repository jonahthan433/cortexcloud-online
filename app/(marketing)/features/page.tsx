import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Workflow,
  FileText,
  Zap,
  BarChart3,
  Users,
  Shield,
  Brain,
  Clock,
  GitBranch,
  Database,
  Lock,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Features - CortexCloud',
  description: 'Discover all the powerful features of CortexCloud business automation platform',
};

export default function FeaturesPage() {
  const features = [
    {
      name: 'Visual Workflow Builder',
      description:
        'Create complex automations with our intuitive drag-and-drop interface. No coding required.',
      icon: Workflow,
      details: [
        'Drag-and-drop interface',
        'Pre-built templates',
        'Conditional logic',
        'Loop and branch actions',
      ],
      badge: 'Popular',
    },
    {
      name: 'AI Document Processing',
      description:
        'Extract, analyze, and process documents automatically using advanced AI technology.',
      icon: FileText,
      details: [
        'Text extraction',
        'Data categorization',
        'Multi-format support',
        'OCR capabilities',
      ],
      badge: 'AI Powered',
    },
    {
      name: 'Smart Integrations',
      description:
        'Connect with 100+ popular services and APIs seamlessly.',
      icon: Zap,
      details: [
        'Pre-built connectors',
        'Custom API support',
        'OAuth authentication',
        'Webhook triggers',
      ],
    },
    {
      name: 'Real-time Analytics',
      description:
        'Track performance and optimize your workflows with detailed insights.',
      icon: BarChart3,
      details: [
        'Execution metrics',
        'Success rates',
        'Performance trends',
        'Custom reports',
      ],
    },
    {
      name: 'Team Collaboration',
      description:
        'Work together with role-based access control and shared workspaces.',
      icon: Users,
      details: [
        'Shared workspaces',
        'Role management',
        'Activity logs',
        'Team notifications',
      ],
    },
    {
      name: 'Enterprise Security',
      description:
        'Bank-level encryption and compliance with industry standards.',
      icon: Shield,
      details: [
        'SOC 2 compliant',
        'GDPR ready',
        'Data encryption',
        'SSO support',
      ],
      badge: 'Enterprise',
    },
    {
      name: 'Natural Language AI',
      description:
        'Describe what you want to automate and let AI build the workflow for you.',
      icon: Brain,
      details: [
        'AI workflow generation',
        'Smart suggestions',
        'Error interpretation',
        'Auto-optimization',
      ],
      badge: 'AI Powered',
    },
    {
      name: 'Scheduled Automation',
      description:
        'Run workflows on a schedule or trigger them based on specific events.',
      icon: Clock,
      details: [
        'Cron scheduling',
        'Event triggers',
        'Delay actions',
        'Time zone support',
      ],
    },
    {
      name: 'Version Control',
      description:
        'Track changes, rollback versions, and maintain workflow history.',
      icon: GitBranch,
      details: [
        'Version history',
        'Rollback support',
        'Change tracking',
        'Workflow templates',
      ],
    },
    {
      name: 'Data Management',
      description:
        'Store, transform, and manage data across your automations.',
      icon: Database,
      details: [
        'Data storage',
        'Transformations',
        'Variable support',
        'Database connections',
      ],
    },
    {
      name: 'API Access',
      description:
        'Full API access to integrate CortexCloud into your applications.',
      icon: Lock,
      details: [
        'RESTful API',
        'API keys',
        'Webhooks',
        'SDKs available',
      ],
    },
    {
      name: 'Fast Execution',
      description:
        'Lightning-fast workflow execution with guaranteed uptime.',
      icon: Rocket,
      details: [
        '99.9% uptime',
        'Sub-second latency',
        'Auto-scaling',
        'Global CDN',
      ],
    },
  ];

  const useCases = [
    {
      title: 'Marketing Automation',
      description: 'Automate email campaigns, lead nurturing, and social media posting',
      examples: [
        'Automated drip campaigns',
        'Lead scoring',
        'Social media scheduling',
      ],
    },
    {
      title: 'Sales Operations',
      description: 'Streamline your sales process from lead to close',
      examples: [
        'CRM data sync',
        'Proposal generation',
        'Follow-up reminders',
      ],
    },
    {
      title: 'Customer Support',
      description: 'Provide faster, better support with automated workflows',
      examples: [
        'Ticket routing',
        'Auto-responses',
        'Satisfaction surveys',
      ],
    },
    {
      title: 'Financial Processing',
      description: 'Automate invoicing, payments, and expense management',
      examples: [
        'Invoice generation',
        'Payment tracking',
        'Expense reporting',
      ],
    },
  ];

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Powerful Features for Modern Teams
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Everything you need to automate your business processes and scale efficiently
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 grid max-w-7xl gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary">{feature.badge}</Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{feature.name}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Use Cases */}
        <div className="mt-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for Every Use Case
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Whatever your industry, CortexCloud can help automate your workflows
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl gap-8 lg:grid-cols-2">
            {useCases.map((useCase) => (
              <Card key={useCase.title}>
                <CardHeader>
                  <CardTitle>{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {useCase.examples.map((example) => (
                      <li key={example} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
                          <span className="text-xs font-bold text-primary">✓</span>
                        </div>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 rounded-3xl bg-primary px-6 py-16 text-center sm:px-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


