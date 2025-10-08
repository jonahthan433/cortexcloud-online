import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface TrialExpirationEmailProps {
  userName?: string;
  expirationDate: string;
  daysRemaining: number;
  type: 'warning' | 'expired';
}

export const TrialExpirationEmail = ({ userName, expirationDate, daysRemaining, type }: TrialExpirationEmailProps) => {
  const isWarning = type === 'warning';

  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className={`${isWarning ? 'bg-yellow-500' : 'bg-red-500'} p-6 text-white text-center`}>
        <img 
          src="/src/assets/cortex-logo.jpg" 
          alt="CortexCloud" 
          className="h-12 w-auto mx-auto mb-4 brightness-110 contrast-110"
        />
        <h1 className="text-2xl font-bold">
          {isWarning ? 'Trial Ending Soon' : 'Trial Has Expired'}
        </h1>
        {isWarning ? (
          <p className="text-yellow-100 mt-2">
            Only {daysRemaining} days left in your free trial
          </p>
        ) : (
          <p className="text-red-100 mt-2">
            Your CortexCloud trial has ended
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Hi {userName || 'there'},
        </h2>
        
        {isWarning ? (
          <p className="text-gray-600 mb-6">
            This is a friendly reminder that your CortexCloud free trial will expire on {expirationDate}.
            Don't lose access to your automations and data – upgrade now to continue enjoying all features
            without interruption.
          </p>
        ) : (
          <p className="text-gray-600 mb-6">
            Your CortexCloud free trial expired on {expirationDate}. We hope you found the platform
            valuable for your business. To continue using CortexCloud and maintain access to your
            data and automations, please upgrade to a paid plan.
          </p>
        )}

        {/* Trial Details */}
        <Card className="mb-6 border border-gray-200">
          <CardHeader className={`${isWarning ? 'bg-yellow-50' : 'bg-red-50'}`}>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className={`h-5 w-5 ${isWarning ? 'text-yellow-500' : 'text-red-500'}`} />
              <span>{isWarning ? 'Trial Expiring Soon' : 'Trial Expired'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${isWarning ? 'text-yellow-500' : 'text-red-500'}`}>
                  {isWarning ? 'Ending Soon' : 'Expired'}
                </span>
              </div>
              {isWarning && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Remaining:</span>
                  <span className="font-semibold text-yellow-500">{daysRemaining}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isWarning ? 'Expires On:' : 'Expired On:'}
                </span>
                <span className="font-semibold">{expirationDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">What You'll Keep With an Upgrade:</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              All your existing contacts and data
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Your automations and workflows
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Custom integrations and settings
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Historical analytics and reports
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Button className="w-full md:w-auto px-8" asChild>
            <a href="/checkout">Upgrade Now</a>
          </Button>
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at support@cortexcloud.ai
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 text-center text-sm text-gray-500">
        <p>CortexCloud | 123 Innovation Way, Tech City, TC 12345</p>
        <p className="mt-2">
          <a href="#" className="text-blue-600 hover:underline">Unsubscribe</a> • 
          <a href="#" className="text-blue-600 hover:underline ml-2">Privacy Policy</a> • 
          <a href="#" className="text-blue-600 hover:underline ml-2">Terms of Service</a>
        </p>
      </div>
    </div>
  );
};