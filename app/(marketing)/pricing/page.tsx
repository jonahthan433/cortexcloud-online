import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata = {
  title: 'Pricing - CortexCloud',
  description: 'Choose the perfect plan for your business automation needs',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out CortexCloud',
      features: [
        '100 workflow runs/month',
        'Basic CRM & Pipeline',
        'Automation Builder',
        '1 user',
        'Email support',
      ],
      cta: 'Start Free',
      href: '/signup',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      description: 'For growing teams and businesses',
      features: [
        '5,000 workflow runs/month',
        'Unlimited CRM contacts',
        'AI-Powered Automation',
        '5 users',
        'Advanced integrations',
        'Priority support',
        'Analytics dashboard',
      ],
      cta: 'Start Trial',
      href: '/signup?plan=professional',
      popular: true,
    },
    {
      name: 'Business',
      price: '$149',
      period: '/month',
      description: 'For established businesses',
      features: [
        '25,000 workflow runs/month',
        'Unlimited everything',
        '20 users',
        'Team collaboration',
        'WhatsApp & Slack integration',
        'Dedicated support',
        'API access',
        'Custom branding',
      ],
      cta: 'Start Trial',
      href: '/signup?plan=business',
      popular: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited users & workflows',
        'SSO & SAML authentication',
        'White-label options',
        'Dedicated account manager',
        'Custom SLA & support',
        'On-premise deployment',
        'Training & onboarding',
      ],
      cta: 'Contact Sales',
      href: '/contact',
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I change plans later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we will prorate any charges.',
    },
    {
      question: 'What happens after the free trial?',
      answer: 'After your 14-day trial, you can choose to upgrade to a paid plan or continue with the free Starter plan with limited features.',
    },
    {
      question: 'Do you offer annual billing?',
      answer: 'Yes! Save 20% by choosing annual billing on any paid plan. Contact us for details.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and can arrange invoice billing for Enterprise customers.',
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No, there are no setup fees for any plan. You only pay the monthly or annual subscription cost.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.',
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'All plans include email support. Professional and Business plans get priority support, and Enterprise includes 24/7 phone support with a dedicated account manager.',
    },
    {
      question: 'Do you offer a money-back guarantee?',
      answer: 'Yes! We offer a 30-day money-back guarantee on all paid plans. If you are not satisfied, we will refund your payment, no questions asked.',
    },
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Choose the perfect plan for your business. All plans include a 14-day free trial.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900 dark:text-green-100">
              20% off annual plans
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              30-day money-back guarantee
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-4">
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
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Still have questions?
          </h3>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <Link href="/contact" className="mt-6 inline-block">
            <Button size="lg">Contact Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


