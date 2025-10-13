import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Calendar, Zap } from 'lucide-react';

export interface ActivationEmailProps {
  userName: string;
  planName: string;
  activationLink: string;
}

export const activationEmailTemplate = ({ userName, planName, activationLink }: ActivationEmailProps): string => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <div style="background:linear-gradient(to right, #2563eb, #9333ea);color:white;padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:24px;">Welcome to CortexCloud!</h1>
        <p style="margin:8px 0 0;color:#bfdbfe;">Your ${planName} trial is ready</p>
      </div>
      
      <div style="padding:24px;">
        <h2 style="color:#111827;font-size:20px;margin:0 0 16px;">Hi ${userName},</h2>
        
        <p style="color:#4b5563;margin:0 0 24px;">
          Thank you for starting your free trial with CortexCloud! We're excited to help you 
          transform your business with our comprehensive automation platform.
        </p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin:0 0 24px;padding:16px;">
          <h3 style="color:#111827;font-size:18px;margin:0 0 12px;">Your Trial Details</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#4b5563;padding:4px 0;">Plan:</td>
              <td style="font-weight:600;text-align:right;">${planName}</td>
            </tr>
            <tr>
              <td style="color:#4b5563;padding:4px 0;">Duration:</td>
              <td style="font-weight:600;text-align:right;">14 Days</td>
            </tr>
            <tr>
              <td style="color:#4b5563;padding:4px 0;">Features:</td>
              <td style="font-weight:600;text-align:right;">Full Access</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${activationLink}" style="display:inline-block;background-color:#2563eb;color:white;text-decoration:none;padding:12px 32px;border-radius:4px;font-weight:500;">
            Activate Your Account
          </a>
        </div>

        <p style="color:#4b5563;text-align:center;margin:0 0 24px;">
          This link will expire in 24 hours for security reasons.
        </p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin:0 0 24px;padding:16px;">
          <h3 style="color:#111827;font-size:18px;margin:0 0 12px;">What's Next?</h3>
          <div style="margin:0 0 12px;">
            <p style="margin:0;font-weight:500;color:#111827;">1. Complete Your Profile</p>
            <p style="margin:4px 0 0;color:#4b5563;font-size:14px;">Set up your business information and preferences</p>
          </div>
          <div style="margin:0 0 12px;">
            <p style="margin:0;font-weight:500;color:#111827;">2. Import Your Data</p>
            <p style="margin:4px 0 0;color:#4b5563;font-size:14px;">Connect your existing tools and import contacts</p>
          </div>
          <div>
            <p style="margin:0;font-weight:500;color:#111827;">3. Start Automating</p>
            <p style="margin:4px 0 0;color:#4b5563;font-size:14px;">Create your first automation workflow</p>
          </div>
        </div>

        <div style="text-align:center;color:#4b5563;margin:0 0 24px;">
          <p style="margin:0 0 8px;">Need help getting started?</p>
          <p style="margin:0;font-size:14px;">
            Our support team is here to help! Email us at 
            <a href="mailto:support@cortexcloud.com" style="color:#2563eb;text-decoration:none;">
              support@cortexcloud.com
            </a>
          </p>
        </div>

        <hr style="border:0;border-top:1px solid #e5e7eb;margin:0 0 24px;" />

        <div style="text-align:center;font-size:14px;color:#6b7280;">
          <p style="margin:0 0 8px;">
            This email was sent to you because you started a free trial with CortexCloud.
          </p>
          <p style="margin:0;">
            If you didn't request this, please ignore this email or
            <a href="#" style="color:#2563eb;text-decoration:none;">contact support</a>.
          </p>
        </div>
      </div>

      <div style="background:#f9fafb;padding:24px;text-align:center;font-size:14px;color:#6b7280;">
        <p style="margin:0 0 8px;">© 2024 CortexCloud. All rights reserved.</p>
        <p style="margin:0;">
          123 Business St, Suite 100, City, State 12345 |
          <a href="#" style="color:#2563eb;text-decoration:none;margin:0 4px;">Privacy Policy</a> |
          <a href="#" style="color:#2563eb;text-decoration:none;margin:0 4px;">Terms of Service</a>
        </p>
      </div>
    </div>
  </body>
</html>`;
}

export const ActivationEmail = ({ userName, planName, activationLink }: ActivationEmailProps) => {
  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
        <img 
          src="/src/assets/cortex-logo.jpg" 
          alt="CortexCloud" 
          className="h-12 w-auto mx-auto mb-4 brightness-110 contrast-110"
        />
        <h1 className="text-2xl font-bold">Welcome to CortexCloud!</h1>
        <p className="text-blue-100 mt-2">Your {planName} trial is ready</p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Hi {userName},
        </h2>
        
        <p className="text-gray-600 mb-6">
          Thank you for starting your free trial with CortexCloud! We're excited to help you 
          transform your business with our comprehensive automation platform.
        </p>

        {/* Trial Details */}
        <Card className="mb-6 border border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Your Trial Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-semibold">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">14 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Features:</span>
                <span className="font-semibold">Full Access</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activation Button */}
        <div className="text-center mb-6">
          <Button 
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <a href={activationLink}>
              <CheckCircle className="h-5 w-5 mr-2" />
              Activate Your Account
              <ArrowRight className="h-5 w-5 ml-2" />
            </a>
          </Button>
        </div>

        <p className="text-gray-600 mb-6 text-center">
          This link will expire in 24 hours for security reasons.
        </p>

        {/* What's Next */}
        <Card className="mb-6 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>What's Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Complete Your Profile</p>
                  <p className="text-sm text-gray-600">Set up your business information and preferences</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Import Your Data</p>
                  <p className="text-sm text-gray-600">Connect your existing tools and import contacts</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start Automating</p>
                  <p className="text-sm text-gray-600">Create your first automation workflow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center text-gray-600 mb-6">
          <p className="mb-2">Need help getting started?</p>
          <p className="text-sm">
            Our support team is here to help! Email us at{' '}
            <a href="mailto:support@cortexcloud.com" className="text-blue-600 hover:underline">
              support@cortexcloud.com
            </a>
          </p>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">
            This email was sent to you because you started a free trial with CortexCloud.
          </p>
          <p>
            If you didn't request this, please ignore this email or{' '}
            <a href="#" className="text-blue-600 hover:underline">contact support</a>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-6 text-center text-sm text-gray-500">
        <p className="mb-2">© 2024 CortexCloud. All rights reserved.</p>
        <p>
          123 Business St, Suite 100, City, State 12345 | 
          <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a> | 
          <a href="#" className="text-blue-600 hover:underline ml-1">Terms of Service</a>
        </p>
      </div>
    </div>
  );
};
