import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `Blog Post - CortexCloud`,
    description: 'Read our latest insights on automation and AI',
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In production, fetch this from your CMS or database
  const post = {
    title: 'Getting Started with Business Automation in 2024',
    author: 'Sarah Chen',
    date: '2024-10-01',
    readTime: '5 min read',
    category: 'Automation',
    image: '📊',
    content: `
      <h2>Introduction</h2>
      <p>Business automation has become essential for companies of all sizes. In this comprehensive guide, we'll explore how to get started with automation in your business.</p>
      
      <h2>Why Automation Matters</h2>
      <p>Automation helps businesses:</p>
      <ul>
        <li>Save time on repetitive tasks</li>
        <li>Reduce human error</li>
        <li>Scale operations efficiently</li>
        <li>Improve customer experience</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Here are the key steps to begin your automation journey:</p>
      
      <h3>1. Identify Repetitive Tasks</h3>
      <p>Look for tasks that you or your team do repeatedly. These are prime candidates for automation.</p>
      
      <h3>2. Choose the Right Tools</h3>
      <p>Select automation tools that integrate well with your existing systems. CortexCloud offers seamless integration with 100+ services.</p>
      
      <h3>3. Start Small</h3>
      <p>Begin with one or two simple workflows. As you gain confidence, you can automate more complex processes.</p>
      
      <h2>Conclusion</h2>
      <p>Automation is not just a trend—it's a necessity for modern businesses. Start small, measure results, and scale what works.</p>
    `
  };

  return (
    <div className="py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/blog" className="mb-8 inline-block">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Post Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-12 flex items-center justify-center rounded-xl bg-muted p-16">
          <div className="text-8xl">{post.image}</div>
        </div>

        {/* Post Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share */}
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Share this article</p>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'AI Document Processing Guide',
                slug: 'ai-document-processing',
                category: 'AI'
              },
              {
                title: 'Workflow Best Practices',
                slug: 'workflow-best-practices',
                category: 'Tutorials'
              }
            ].map((relatedPost) => (
              <Card key={relatedPost.slug}>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {relatedPost.category}
                  </Badge>
                  <CardTitle className="mt-2 text-base">{relatedPost.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <Button variant="ghost" size="sm">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


