import { ActivationEmail } from '@/components/emails/ActivationEmail';

const EmailPreview = () => {
  const mockData = {
    userName: "John Smith",
    planName: "Elevate",
    activationLink: "http://localhost:5173/auth/register?token=abc123&activated=true"
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Email Preview</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ActivationEmail 
            userName={mockData.userName}
            planName={mockData.planName}
            activationLink={mockData.activationLink}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
