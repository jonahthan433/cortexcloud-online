import { createClient } from '@supabase/supabase-js';
import * as sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY'));

// Initialize Supabase Admin client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export async function sendEmail(req: Request): Promise<Response> {
  try {
    // Verify request is from our service
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${Deno.env.get('EDGE_FUNCTION_SECRET')}`) {
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), { status: 401 });
    }

    // Parse request body
    const emailData: EmailData = await req.json();
    const { to, subject, template, data } = emailData;

    // Validate required fields
    if (!to || !subject || !template || !data) {
      return new Response(JSON.stringify({
        error: 'Missing required fields'
      }), { status: 400 });
    }

    // Get email template from database
    const { data: templateData, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('html_content')
      .eq('name', template)
      .single();

    if (templateError || !templateData) {
      return new Response(JSON.stringify({
        error: 'Template not found'
      }), { status: 404 });
    }

    // Replace template variables with actual data
    let htmlContent = templateData.html_content;
    Object.entries(data).forEach(([key, value]) => {
      htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    // Send email
    const msg = {
      to,
      from: 'noreply@cortexcloud.online', // verified sender
      subject,
      html: htmlContent,
    };

    await sgMail.send(msg);

    // Log email sent
    await supabaseClient
      .from('email_logs')
      .insert({
        recipient: to,
        template,
        subject,
        status: 'sent',
        metadata: data
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully'
    }), { status: 200 });

  } catch (error) {
    // Log error
    console.error('Error sending email:', error);

    await supabaseClient
      .from('email_logs')
      .insert({
        recipient: error.recipient,
        template: error.template,
        subject: error.subject,
        status: 'failed',
        error: error.message
      });

    return new Response(JSON.stringify({
      error: 'Failed to send email',
      details: error.message
    }), { status: 500 });
  }
}