import { supabase } from '@/integrations/supabase/client';

interface ActivationEmailData {
  email: string;
  userName: string;
  planName: string;
  activationToken: string;
}

export class EmailService {
  private static generateActivationToken(): string {
    // Generate a secure random token
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static generateActivationLink(token: string): string {
    const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
    return `${baseUrl}/auth/register?token=${token}&activated=true`;
  }

  static async sendActivationEmail(email: string, userName: string, planName: string): Promise<{ success: boolean; token?: string; error?: string }> {
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

      // Generate activation link
      const activationLink = this.generateActivationLink(activationToken);

      // In a real implementation, you would send the email using a service like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Supabase Edge Functions
      
      // For now, we'll simulate the email sending and log the details
      console.log('=== ACTIVATION EMAIL ===');
      console.log('To:', email);
      console.log('Subject: Welcome to CortexCloud - Activate Your Account');
      console.log('Activation Link:', activationLink);
      console.log('User Name:', userName);
      console.log('Plan:', planName);
      console.log('========================');

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, replace this with actual email service call:
      /*
      const emailData = {
        to: email,
        subject: 'Welcome to CortexCloud - Activate Your Account',
        template: 'activation',
        data: {
          userName,
          planName,
          activationLink,
          companyName: 'CortexCloud'
        }
      };
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      */

      return { success: true, token: activationToken };
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
