import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Heart, Zap } from 'lucide-react';

export const metadata = {
  title: 'About Us - CortexCloud',
  description: 'Learn about CortexCloud mission to democratize AI automation',
};

export default function AboutPage() {
  const values = [
    {
      name: 'Innovation',
      description: 'We push the boundaries of what\'s possible with AI and automation',
      icon: Zap,
    },
    {
      name: 'Customer First',
      description: 'Your success is our success. We build for you.',
      icon: Heart,
    },
    {
      name: 'Simplicity',
      description: 'Powerful doesn\'t have to mean complicated.',
      icon: Target,
    },
    {
      name: 'Collaboration',
      description: 'Better together. We believe in the power of teamwork.',
      icon: Users,
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-founder',
      bio: 'Former VP of Engineering at tech unicorn. 15 years in automation.',
      image: '👩‍💼',
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-founder',
      bio: 'PhD in AI/ML. Built automation systems at Fortune 500 companies.',
      image: '👨‍💻',
    },
    {
      name: 'Emily Watson',
      role: 'Head of Product',
      bio: 'Product leader with passion for user experience and design.',
      image: '👩‍🎨',
    },
    {
      name: 'David Kim',
      role: 'Head of Customer Success',
      bio: 'Dedicated to helping customers achieve their automation goals.',
      image: '👨‍💼',
    },
  ];

  const milestones = [
    { year: '2022', event: 'Company founded' },
    { year: '2022', event: 'Seed funding raised' },
    { year: '2023', event: '1,000+ customers' },
    { year: '2023', event: 'Series A funding' },
    { year: '2024', event: '10,000+ customers' },
    { year: '2024', event: 'Enterprise launch' },
  ];

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">About Us</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Democratizing AI Automation
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We're on a mission to make powerful business automation accessible to everyone,
            regardless of technical expertise.
          </p>
        </div>

        {/* Mission */}
        <div className="mx-auto mt-32 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-center">
            Every business deserves the power of automation. We believe that AI-powered workflows
            shouldn't be limited to enterprises with massive IT budgets. CortexCloud makes
            sophisticated automation simple, affordable, and accessible to businesses of all sizes.
          </p>
        </div>

        {/* Values */}
        <div className="mx-auto mt-32 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
            Our Values
          </h2>
          <div className="mt-16 grid gap-8 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.name}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{value.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mx-auto mt-32 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-6 text-center text-lg text-muted-foreground">
            Passionate people building the future of automation
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 text-6xl">{member.image}</div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mx-auto mt-32 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
            Our Journey
          </h2>
          <div className="mt-16 space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {milestone.year.slice(2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-border" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-semibold">{milestone.year}</p>
                  <p className="text-muted-foreground">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Careers CTA */}
        <div className="mx-auto mt-32 max-w-2xl rounded-3xl bg-muted p-8 text-center" id="careers">
          <h2 className="text-2xl font-bold">Join Our Team</h2>
          <p className="mt-4 text-muted-foreground">
            We're always looking for talented people to join our mission.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            📧 careers@cortexcloud.online
          </p>
        </div>
      </div>
    </div>
  );
}


