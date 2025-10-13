import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog - CortexCloud',
  description: 'Latest insights on automation, AI, and business productivity',
};

export default function BlogPage() {
  const blogPosts = [
    {
      slug: 'getting-started-with-automation',
      title: 'Getting Started with Business Automation in 2024',
      excerpt: 'Learn the fundamentals of business automation and how AI is transforming workflows.',
      author: 'Sarah Chen',
      date: '2024-10-01',
      readTime: '5 min read',
      category: 'Automation',
      image: '📊'
    },
    {
      slug: 'ai-document-processing',
      title: 'How AI Document Processing Saves 20 Hours Per Week',
      excerpt: 'Discover how modern businesses are using AI to process documents automatically.',
      author: 'Michael Rodriguez',
      date: '2024-09-28',
      readTime: '7 min read',
      category: 'AI',
      image: '🤖'
    },
    {
      slug: 'workflow-best-practices',
      title: '10 Best Practices for Building Effective Workflows',
      excerpt: 'Expert tips for creating workflows that actually work and scale with your business.',
      author: 'Emily Watson',
      date: '2024-09-25',
      readTime: '6 min read',
      category: 'Tutorials',
      image: '⚡'
    },
    {
      slug: 'case-study-tech-startup',
      title: 'Case Study: How a Tech Startup Automated 80% of Their Operations',
      excerpt: 'Real-world example of automation success with detailed metrics and insights.',
      author: 'David Kim',
      date: '2024-09-20',
      readTime: '10 min read',
      category: 'Case Studies',
      image: '📈'
    },
    {
      slug: 'integration-guide',
      title: 'Complete Guide to Third-Party Integrations',
      excerpt: 'Everything you need to know about connecting your tools with CortexCloud.',
      author: 'Sarah Chen',
      date: '2024-09-15',
      readTime: '8 min read',
      category: 'Tutorials',
      image: '🔌'
    }
  ];

  const categories = ['All', 'Automation', 'AI', 'Tutorials', 'Case Studies'];

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Blog
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Insights on automation, AI, and building better businesses
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="h-12 pl-12 text-base"
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div className="mx-auto mt-16 grid max-w-7xl gap-8 lg:grid-cols-2">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="overflow-hidden">
              <div className="p-8 text-center text-6xl">{post.image}</div>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{post.author}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
}


