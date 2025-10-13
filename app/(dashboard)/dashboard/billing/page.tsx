'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle2, Download, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function BillingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [subRes, usageRes] = await Promise.all([
        fetch('/api/billing/subscription'),
        fetch('/api/billing/usage'),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData.subscription);
      }

      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setUsage(usageData.usage);
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      features: [
        '5,000 workflow runs',
        '500 documents',
        '5 users',
        'Advanced AI features',
        'Priority support',
      ],
      planId: 'professional',
    },
    {
      name: 'Business',
      price: '$149',
      period: '/month',
      features: [
        '25,000 workflow runs',
        'Unlimited documents',
        '20 users',
        'Custom integrations',
        'Dedicated support',
      ],
      planId: 'business',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited everything',
        'Unlimited users',
        'SSO & SAML',
        'Dedicated account manager',
        'Custom SLA',
      ],
      planId: 'enterprise',
    },
  ];

  const currentPlan = session?.user?.subscriptionTier || 'TRIAL';
  const usagePercent = usage
    ? {
        workflows: (usage.workflow_runs / 100) * 100,
        documents: (usage.documents_processed / 10) * 100,
      }
    : { workflows: 0, documents: 0 };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your plan, usage, and billing information
        </p>
      </div>

      {/* Current Plan */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">{currentPlan}</h3>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentPlan === 'TRIAL'
                    ? 'Free trial - 14 days remaining'
                    : 'Renews monthly'}
                </p>
              </div>
              <CreditCard className="h-12 w-12 text-muted-foreground" />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Next billing date</span>
                <span className="font-medium">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Payment method</span>
                <span className="font-medium">•••• 4242</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleManageBilling}
              disabled={loading}
            >
              Manage Billing
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage This Period</CardTitle>
            <CardDescription>Track your current usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Workflow Runs</span>
                <span className="font-medium">
                  {usage?.workflow_runs || 0} / {100}
                </span>
              </div>
              <Progress value={usagePercent.workflows} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Documents Processed</span>
                <span className="font-medium">
                  {usage?.documents_processed || 0} / {10}
                </span>
              </div>
              <Progress value={usagePercent.documents} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>API Calls</span>
                <span className="font-medium">
                  {usage?.api_calls || 0} / {1000}
                </span>
              </div>
              <Progress
                value={((usage?.api_calls || 0) / 1000) * 100}
                className="h-2"
              />
            </div>

            {currentPlan === 'TRIAL' && (
              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/10">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  You're on the free trial. Upgrade to get more capacity.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Plans */}
      {currentPlan === 'TRIAL' && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Upgrade Your Plan</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={plan.popular ? 'border-primary shadow-lg' : ''}
              >
                {plan.popular && (
                  <div className="bg-primary px-4 py-1 text-center text-sm font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() =>
                      plan.planId === 'enterprise'
                        ? (window.location.href = '/contact')
                        : handleUpgrade(plan.planId)
                    }
                    disabled={loading}
                  >
                    {plan.planId === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No billing history yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>${invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant="default">{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


