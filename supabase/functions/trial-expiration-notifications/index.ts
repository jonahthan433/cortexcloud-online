import { serve } from 'std/http/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, createErrorResponse, createSuccessResponse } from '../_shared/config';

// Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface User {
  id: string;
  email: string;
  trial_expires_at: string | null;
  trial_reminder_sent: boolean;
  paid_subscription_starts_at: string | null;
}

interface TrialStatus {
  status: 'not_started' | 'active' | 'expired' | 'subscribed' | 'unknown';
  message: string;
  daysRemaining?: number;
  expiresAt?: string;
  expiredAt?: string;
  subscriptionStarted?: string;
}

async function sendTrialReminderEmail(user: User, daysLeft: number): Promise<void> {
  const message = daysLeft > 0 
    ? `Your free trial will expire in ${daysLeft} days` 
    : 'Your free trial has expired';

  await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('EDGE_FUNCTION_SECRET')}`
    },
    body: JSON.stringify({
      to: user.email,
      subject: message,
      template: 'trial_expiration',
      data: {
        daysLeft,
        expireDate: new Date(user.trial_expires_at!).toLocaleDateString(),
        activateLink: `${SUPABASE_URL}/checkout?email=${encodeURIComponent(user.email)}`
      }
    })
  });
}

function calculateTrialStatus(user: User): TrialStatus {
  const now = new Date();

  // Check if user has an active subscription
  if (user.paid_subscription_starts_at) {
    const subscriptionStartDate = new Date(user.paid_subscription_starts_at);
    if (subscriptionStartDate <= now) {
      return {
        status: 'subscribed',
        message: 'User has an active paid subscription',
        subscriptionStarted: user.paid_subscription_starts_at
      };
    }
  }

  // Check trial status
  if (!user.trial_expires_at) {
    return {
      status: 'not_started',
      message: 'Trial has not started yet'
    };
  }

  const trialExpireDate = new Date(user.trial_expires_at);
  const daysRemaining = Math.ceil((trialExpireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (trialExpireDate > now) {
    return {
      status: 'active',
      message: `Trial is active with ${daysRemaining} days remaining`,
      daysRemaining,
      expiresAt: user.trial_expires_at
    };
  } else {
    return {
      status: 'expired',
      message: 'Trial has expired',
      expiredAt: user.trial_expires_at
    };
  }
}

async function handleCheckTrialStatus(userId: string): Promise<Response> {
  // Fetch user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, trial_expires_at, trial_reminder_sent, paid_subscription_starts_at')
    .eq('id', userId)
    .single();

  if (userError) {
    return createErrorResponse('Failed to fetch user', userError);
  }

  const status = calculateTrialStatus(user);

  // Update user's trial status in the database
  await supabase
    .from('users')
    .update({ trial_status: status.status })
    .eq('id', userId);

  return createSuccessResponse(status);
}

async function handleProcessTrialExpirations(): Promise<Response> {
  try {
    // Get all users in trial with expiration dates
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, trial_expires_at, trial_reminder_sent, paid_subscription_starts_at')
      .not('trial_expires_at', 'is', null)
      .eq('trial_reminder_sent', false);

    if (usersError) {
      return createErrorResponse('Failed to fetch users', usersError);
    }

    const processedUsers = [];

    // Process each user
    for (const user of users) {
      const status = calculateTrialStatus(user);
      const daysRemaining = status.daysRemaining ?? 0;

      // Send reminder for trials expiring in 3 days or already expired
      if ((status.status === 'active' && daysRemaining <= 3) || status.status === 'expired') {
        await sendTrialReminderEmail(user, daysRemaining);
        
        // Mark reminder as sent
        await supabase
          .from('users')
          .update({ 
            trial_reminder_sent: true,
            trial_status: status.status
          })
          .eq('id', user.id);

        processedUsers.push({
          id: user.id,
          email: user.email,
          status: status.status,
          daysRemaining
        });
      }
    }

    return createSuccessResponse({
      message: `Processed ${processedUsers.length} trial expiration notifications`,
      processedUsers
    });

  } catch (error) {
    return createErrorResponse('Failed to process trial expirations', error);
  }
}

// Main serve function
serve(async (request: Request) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    // CORS handling
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
        }
      });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Route handling
    if (userId) {
      // Check trial status for specific user
      return await handleCheckTrialStatus(userId);
    } else {
      // Process all trial expirations (for cron job)
      return await handleProcessTrialExpirations();
    }

  } catch (error) {
    return createErrorResponse('Unexpected error occurred', error);
  }
});