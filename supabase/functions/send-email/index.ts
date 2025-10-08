import * as sendgrid from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SENDGRID_API_KEY, createErrorResponse, createSuccessResponse } from '../_shared/config';
import type { SendGridErrorDetails } from '../_shared/config';

// Initialize SendGrid
sendgrid.setApiKey(SENDGRID_API_KEY);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface EmailRequest {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html: string;
  template?: string;
  data?: Record<string, unknown>;
}

// Define SendGrid specific types
interface SendGridMailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

// Handle CORS preflight request
async function handleOptions(request: Request): Promise<Response | Request> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }
  return request;
}

// Verify auth header
function verifyAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  return authHeader === `Bearer ${Deno.env.get('EDGE_FUNCTION_SECRET')}`;
}

// Main function handler
Deno.serve(async (request: Request) => {
  try {
    // Handle CORS
    const response = await handleOptions(request);
    if (response instanceof Response) return response;

    // Only allow POST method
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Verify auth header
    if (!verifyAuth(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse request body
    const emailRequest = await request.json() as EmailRequest;
    
    // Validate request
    if (!emailRequest.to || !emailRequest.subject || !emailRequest.html) {
      return createErrorResponse('Missing required fields', {
        to: !emailRequest.to ? 'missing' : 'ok',
        subject: !emailRequest.subject ? 'missing' : 'ok',
        html: !emailRequest.html ? 'missing' : 'ok'
      });
    }

    let htmlContent = emailRequest.html;

    // If template is provided, get it from database and apply variables
    if (emailRequest.template) {
      const { data: templateData, error: templateError } = await supabase
        .from('email_templates')
        .select('html_content')
        .eq('name', emailRequest.template)
        .single();

      if (templateError || !templateData) {
        return createErrorResponse('Template not found', { template: emailRequest.template });
      }

      htmlContent = templateData.html_content;

      // Replace template variables if data is provided
      if (emailRequest.data) {
        Object.entries(emailRequest.data).forEach(([key, value]) => {
          htmlContent = htmlContent.replace(
            new RegExp(`{{${key}}}`, 'g'), 
            String(value)
          );
        });
      }
    }

    // Prepare email data
    const msg: SendGridMailData = {
      to: emailRequest.to,
      from: emailRequest.from || 'noreply@cortexcloud.com',
      subject: emailRequest.subject,
      text: emailRequest.text || '',
      html: htmlContent,
    };

    // Send email
    const result = await sendgrid.send(msg);
    
    // Log success
    await supabase.from('email_logs').insert({
      recipient: emailRequest.to,
      template: emailRequest.template,
      subject: emailRequest.subject,
      status: 'sent',
      sent_at: new Date().toISOString(),
      metadata: emailRequest.data
    });

    return createSuccessResponse({
      message: 'Email sent successfully',
      statusCode: result[0].statusCode
    });

  } catch (error: unknown) {
    console.error('Error sending email:', error);

    // Log error
    const errorDetails: SendGridErrorDetails = {
      recipient: (error as any).recipient || 'unknown',
      template: (error as any).template,
      subject: (error as any).subject,
      message: error instanceof Error ? error.message : String(error)
    };

    await supabase.from('email_logs').insert({
      recipient: errorDetails.recipient,
      template: errorDetails.template,
      subject: errorDetails.subject || '',
      status: 'error',
      error: errorDetails.message,
      sent_at: new Date().toISOString()
    });

    return createErrorResponse('Failed to send email', errorDetails);
  }
});