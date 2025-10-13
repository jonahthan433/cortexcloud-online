import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Price IDs from environment
export const STRIPE_PRICES = {
  STARTER: process.env.STRIPE_PRICE_STARTER || '',
  PROFESSIONAL: process.env.STRIPE_PRICE_PROFESSIONAL || '',
  BUSINESS: process.env.STRIPE_PRICE_BUSINESS || '',
};

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    name: 'Starter',
    price: 0,
    priceId: STRIPE_PRICES.STARTER,
    features: [
      '100 workflow runs/month',
      '10 documents',
      '1 user',
      'Basic features',
      'Email support',
    ],
    limits: {
      workflow_runs: 100,
      documents: 10,
      users: 1,
      api_calls: 1000,
      integrations: 2,
    },
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 49,
    priceId: STRIPE_PRICES.PROFESSIONAL,
    features: [
      '5,000 workflow runs/month',
      '500 documents',
      '5 users',
      'Advanced AI features',
      'Priority support',
      'Custom integrations',
    ],
    limits: {
      workflow_runs: 5000,
      documents: 500,
      users: 5,
      api_calls: 50000,
      integrations: 10,
    },
  },
  BUSINESS: {
    name: 'Business',
    price: 149,
    priceId: STRIPE_PRICES.BUSINESS,
    features: [
      '25,000 workflow runs/month',
      'Unlimited documents',
      '20 users',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Advanced analytics',
    ],
    limits: {
      workflow_runs: 25000,
      documents: -1,
      users: 20,
      api_calls: 250000,
      integrations: -1,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: null,
    priceId: null,
    features: [
      'Unlimited everything',
      'Unlimited users',
      'SSO & SAML',
      'Dedicated account manager',
      'Custom SLA',
      'On-premise option',
      'White-label available',
    ],
    limits: {
      workflow_runs: -1,
      documents: -1,
      users: -1,
      api_calls: -1,
      integrations: -1,
    },
  },
};

export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  customerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  });

  return session;
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function createOrUpdateCustomer({
  email,
  name,
  metadata = {},
}: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    // Update existing customer
    return await stripe.customers.update(existingCustomers.data[0].id, {
      name,
      metadata,
    });
  }

  // Create new customer
  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription({
  subscriptionId,
  priceId,
}: {
  subscriptionId: string;
  priceId: string;
}) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function getInvoices(customerId: string, limit = 10) {
  return await stripe.invoices.list({
    customer: customerId,
    limit,
  });
}

// Webhook helpers
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}


