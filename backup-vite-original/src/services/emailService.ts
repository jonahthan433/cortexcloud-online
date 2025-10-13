// Import email templates
import { activationEmailTemplate } from '@/components/emails/ActivationEmail';
import { welcomeEmailTemplate } from '@/components/emails/WelcomeEmail';
import { supabase } from '@/integrations/supabase/client';

interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

interface SendEmailResponse {
  success: boolean;
  error?: string;
  token?: string;
}

export class EmailService {
  private static async sendEmail(emailData: EmailData): Promise<SendEmailResponse> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_EDGE_FUNCTION_SECRET}`
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  private static generateActivationToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((byte) => chars[byte % chars.length])
      .join('');
  }

  private static generateActivationLink(token: string): string {
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://cortexcloud.online';
    return `${baseUrl}/auth/register?token=${token}&activated=true`;
  }

  static async sendActivationEmail(
    email: string,
    userName: string,
    planName: string
  ): Promise<SendEmailResponse> {
    try {
      // Generate activation token
      const activationToken = this.generateActivationToken();
      
      // Store token in database with expiration (24 hours)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      const { error: tokenError } = await supabase
        .from('activation_tokens')
        .insert({
          email,
          token: activationToken,
          expires_at: expiresAt,
          used: false
        });

      if (tokenError) {
        console.error('Error storing activation token:', tokenError);
        return { success: false, error: 'Failed to create activation token' };
      }

      const activationLink = this.generateActivationLink(activationToken);

      // Send activation email through edge function
      const emailData: EmailData = {
        to: email,
        subject: 'Welcome to CortexCloud - Activate Your Account',
        template: 'activation',
        data: {
          userName,
          planName,
          activationLink,
          companyName: 'CortexCloud',
          emailContent: activationEmailTemplate({
            userName,
            planName,
            activationLink
          })
        }
      };

      const result = await this.sendEmail(emailData);
      if (result.success) {
        return { success: true, token: activationToken };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Error sending activation email:', error);
      return { success: false, error: 'Failed to send activation email' };
    }
  }

  static async verifyActivationToken(token: string): Promise<{ valid: boolean; email?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('activation_tokens')
        .select('email, expires_at, used')
        .eq('token', token)
        .single();

      if (error) {
        return { valid: false, error: 'Invalid or expired token' };
      }

      if (data.used) {
        return { valid: false, error: 'Token has already been used' };
      }

      if (new Date(data.expires_at) < new Date()) {
        return { valid: false, error: 'Token has expired' };
      }

      return { valid: true, email: data.email };
    } catch (error) {
      console.error('Error verifying activation token:', error);
      return { valid: false, error: 'Failed to verify token' };
    }
  }

  static async markTokenAsUsed(token: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activation_tokens')
        .update({ used: true })
        .eq('token', token);

      return !error;
    } catch (error) {
      console.error('Error marking token as used:', error);
      return false;
    }
  }
}
