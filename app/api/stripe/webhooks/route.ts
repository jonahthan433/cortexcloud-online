import { NextRequest, NextResponse } from 'next/server';
import { stripe, constructWebhookEvent } from '@/lib/stripe';
import { prisma, updateUserSubscription, createAuditLog } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;

  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  // Determine subscription tier based on price
  let tier: 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE' = 'PROFESSIONAL';
  const priceId = subscription.items.data[0]?.price.id;

  if (priceId === process.env.STRIPE_PRICE_BUSINESS) {
    tier = 'BUSINESS';
  } else if (priceId?.includes('enterprise')) {
    tier = 'ENTERPRISE';
  }

  // Update or create subscription record
  await prisma.subscription.upsert({
    where: {
      stripe_subscription_id: subscription.id,
    },
    create: {
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      plan_id: tier,
      status: subscription.status.toUpperCase() as any,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
    },
    update: {
      status: subscription.status.toUpperCase() as any,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
  });

  // Update user subscription tier
  await updateUserSubscription(userId, tier);

  // Audit log
  await createAuditLog({
    user_id: userId,
    action: 'subscription.updated',
    entity_type: 'subscription',
    entity_id: subscription.id,
    metadata: { tier, status: subscription.status },
  });
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: {
      stripe_subscription_id: subscription.id,
    },
    data: {
      status: 'CANCELLED',
    },
  });

  const userId = subscription.metadata.user_id;
  if (userId) {
    // Revert to free tier
    await prisma.user.update({
      where: { id: userId },
      data: { subscription_tier: 'STARTER' },
    });

    await createAuditLog({
      user_id: userId,
      action: 'subscription.cancelled',
      entity_type: 'subscription',
      entity_id: subscription.id,
    });
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Payment succeeded for invoice: ${invoice.id}`);
  // Send invoice email, update records, etc.
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Payment failed for invoice: ${invoice.id}`);
  // Send failed payment notification
}


