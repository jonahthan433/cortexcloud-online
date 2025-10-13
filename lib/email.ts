import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set - emails will not be sent');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@cortexcloud.online';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('Email would be sent:', options.subject);
      return { success: true, id: 'test-email-id' };
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Predefined email templates
export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: 'Welcome to CortexCloud!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e40af;">Welcome to CortexCloud, ${name}!</h1>
        <p>We're excited to have you on board. CortexCloud helps you automate your business processes with the power of AI.</p>
        
        <h2>Get Started:</h2>
        <ul>
          <li>Create your first workflow</li>
          <li>Upload documents for processing</li>
          <li>Connect your favorite integrations</li>
        </ul>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Go to Dashboard
        </a>
        
        <p style="margin-top: 30px; color: #666;">
          Need help? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs">documentation</a> or reply to this email.
        </p>
      </div>
    `,
    text: `Welcome to CortexCloud, ${name}! Get started by visiting ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });
}

export async function sendEmailVerification(to: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  return sendEmail({
    to,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e40af;">Verify Your Email</h1>
        <p>Please click the button below to verify your email address:</p>
        
        <a href="${verifyUrl}" 
           style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Verify Email
        </a>
        
        <p style="margin-top: 30px; color: #666;">
          Or copy and paste this URL into your browser: <br/>
          ${verifyUrl}
        </p>
        
        <p style="color: #666;">This link will expire in 24 hours.</p>
      </div>
    `,
    text: `Verify your email: ${verifyUrl}`,
  });
}

export async function sendPasswordReset(to: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  return sendEmail({
    to,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e40af;">Reset Your Password</h1>
        <p>You requested to reset your password. Click the button below to continue:</p>
        
        <a href="${resetUrl}" 
           style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Reset Password
        </a>
        
        <p style="margin-top: 30px; color: #666;">
          Or copy and paste this URL into your browser: <br/>
          ${resetUrl}
        </p>
        
        <p style="color: #666;">This link will expire in 1 hour.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `Reset your password: ${resetUrl}`,
  });
}

export async function sendWorkflowNotification(
  to: string,
  workflowName: string,
  status: 'success' | 'failed',
  details?: string
) {
  const statusColor = status === 'success' ? '#10b981' : '#ef4444';
  const statusText = status === 'success' ? 'Completed Successfully' : 'Failed';
  
  return sendEmail({
    to,
    subject: `Workflow "${workflowName}" ${statusText}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${statusColor};">Workflow ${statusText}</h1>
        <p><strong>Workflow:</strong> ${workflowName}</p>
        <p><strong>Status:</strong> <span style="color: ${statusColor};">${statusText}</span></p>
        ${details ? `<p><strong>Details:</strong> ${details}</p>` : ''}
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/workflows" 
           style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          View Workflows
        </a>
      </div>
    `,
    text: `Workflow "${workflowName}" ${statusText}. ${details || ''}`,
  });
}

export async function sendUsageLimitWarning(
  to: string,
  resourceType: string,
  currentUsage: number,
  limit: number
) {
  const percentage = Math.round((currentUsage / limit) * 100);
  
  return sendEmail({
    to,
    subject: `You're approaching your ${resourceType} limit`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">Usage Limit Warning</h1>
        <p>You've used ${currentUsage} of your ${limit} ${resourceType} this period (${percentage}%).</p>
        
        <p>Consider upgrading your plan to get more capacity:</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
           style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Upgrade Plan
        </a>
      </div>
    `,
    text: `You've used ${currentUsage} of ${limit} ${resourceType} (${percentage}%). Upgrade at ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });
}

export async function sendInvoiceEmail(
  to: string,
  invoiceUrl: string,
  amount: number,
  period: string
) {
  return sendEmail({
    to,
    subject: `Invoice for ${period}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e40af;">Your Invoice</h1>
        <p><strong>Period:</strong> ${period}</p>
        <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
        
        <a href="${invoiceUrl}" 
           style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          View Invoice
        </a>
        
        <p style="margin-top: 30px; color: #666;">
          Thank you for using CortexCloud!
        </p>
      </div>
    `,
    text: `Invoice for ${period}: $${(amount / 100).toFixed(2)}. View at ${invoiceUrl}`,
  });
}

export async function sendTeamInvitation(
  to: string,
  inviterName: string,
  teamName: string,
  inviteUrl: string
) {
  return sendEmail({
    to,
    subject: `${inviterName} invited you to join ${teamName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e40af;">Team Invitation</h1>
        <p>${inviterName} has invited you to join <strong>${teamName}</strong> on CortexCloud.</p>
        
        <a href="${inviteUrl}" 
           style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Accept Invitation
        </a>
        
        <p style="margin-top: 30px; color: #666;">
          This invitation will expire in 7 days.
        </p>
      </div>
    `,
    text: `${inviterName} invited you to join ${teamName}. Accept at ${inviteUrl}`,
  });
}


