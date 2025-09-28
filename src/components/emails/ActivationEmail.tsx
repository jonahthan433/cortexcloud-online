import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Calendar, Zap } from 'lucide-react';

interface ActivationEmailProps {
  userName: string;
  planName: string;
  activationLink: string;
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
