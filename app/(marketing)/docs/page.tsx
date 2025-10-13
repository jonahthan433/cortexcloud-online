import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Code,
  Zap,
  Video,
  MessageSquare,
  Search,
  FileText,
  Workflow,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Documentation - CortexCloud',
  description: 'Learn how to use CortexCloud with our comprehensive documentation and guides',
};

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics and get up and running quickly',
      icon: Zap,
      articles: [
        'Quick Start Guide',
        'Creating Your First Workflow',
        'Understanding Workspaces',
        'Inviting Team Members',
      ],
    },
    {
      title: 'Workflows',
      description: 'Master workflow creation and automation',
      icon: Workflow,
      articles: [
        'Workflow Builder Basics',
        'Triggers and Actions',
        'Conditional Logic',
        'Testing Workflows',
      ],
    },
    {
      title: 'Documents',
      description: 'Process documents with AI',
      icon: FileText,
      articles: [
        'Uploading Documents',
        'AI Processing Features',
        'Data Extraction',
        'Export Options',
      ],
    },
    {
      title: 'Integrations',
      description: 'Connect with your favorite tools',
      icon: Settings,
      articles: [
        'Available Integrations',
        'OAuth Setup',
        'API Keys',
        'Custom Webhooks',
      ],
    },
    {
      title: 'API Reference',
      description: 'Build with our REST API',
      icon: Code,
      articles: [
        'Authentication',
        'Workflows API',
        'Documents API',
        'Rate Limits',
      ],
    },
    {
      title: 'Video Tutorials',
      description: 'Watch and learn',
      icon: Video,
      articles: [
        'Platform Overview',
        'Building Your First Workflow',
        'Advanced Automation',
        'Best Practices',
      ],
    },
  ];

  const popularTopics = [
    'How to create a workflow',
    'Connecting to Slack',
    'Document processing',
    'API authentication',
    'Troubleshooting errors',
    'Billing and pricing',
  ];

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Documentation
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Everything you need to know about using CortexCloud
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              className="h-14 pl-12 text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {popularTopics.map((topic) => (
              <Button key={topic} variant="outline" size="sm">
                {topic}
              </Button>
            ))}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="mx-auto mt-16 grid max-w-7xl gap-8 lg:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.articles.map((article) => (
                    <li key={article}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mx-auto mt-32 grid max-w-6xl gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Developer Guides</CardTitle>
              <CardDescription>
                In-depth guides for developers building with CortexCloud
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-primary hover:underline">
                    REST API Overview →
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Webhook Integration →
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    SDKs and Libraries →
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Community & Support</CardTitle>
              <CardDescription>
                Get help from our community and support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a href="/contact" className="text-primary hover:underline">
                    Contact Support →
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Community Forum →
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Discord Community →
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-32 max-w-2xl rounded-3xl bg-muted p-8 text-center">
          <h2 className="text-2xl font-bold">Can't find what you're looking for?</h2>
          <p className="mt-4 text-muted-foreground">
            Our support team is here to help you succeed
          </p>
          <Link href="/contact" className="mt-6 inline-block">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


