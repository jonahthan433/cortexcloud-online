interface WelcomeEmailProps {
  userName: string;
  planName: string;
}

export const welcomeEmailTemplate = ({ userName, planName }: WelcomeEmailProps): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to CortexCloud - Let's Get Started!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          max-width: 200px;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .step {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .step-number {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
          margin-right: 10px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${import.meta.env.VITE_APP_URL}/images/cortex-logo.jpg" alt="CortexCloud Logo" class="logo">
        <h1>Welcome to CortexCloud!</h1>
      </div>

      <p>Hello ${userName},</p>

      <p>Welcome aboard! Your account is now active with the ${planName} plan. Here's what you need to do next:</p>

      <div class="step">
        <span class="step-number">1</span>
        <strong>Complete Your Profile</strong>
        <p>Add your business information and customize your dashboard settings.</p>
      </div>

      <div class="step">
        <span class="step-number">2</span>
        <strong>Import Your Contacts</strong>
        <p>Bring your existing contacts into CortexCloud or start adding new ones.</p>
      </div>

      <div class="step">
        <span class="step-number">3</span>
        <strong>Set Up Your First Automation</strong>
        <p>Create your first automated workflow to start saving time.</p>
      </div>

      <div class="step">
        <span class="step-number">4</span>
        <strong>Connect Your Tools</strong>
        <p>Integrate your existing tools and services with CortexCloud.</p>
      </div>

      <div style="text-align: center;">
        <a href="${import.meta.env.VITE_APP_URL}/dashboard" class="button">Go to Dashboard</a>
      </div>

      <p>Need help getting started? Check out our:</p>
      <ul>
        <li><a href="${import.meta.env.VITE_APP_URL}/docs/quickstart">Quick Start Guide</a></li>
        <li><a href="${import.meta.env.VITE_APP_URL}/docs/video-tutorials">Video Tutorials</a></li>
        <li><a href="${import.meta.env.VITE_APP_URL}/support">24/7 Support</a></li>
      </ul>

      <p>Best regards,<br>The CortexCloud Team</p>

      <div class="footer">
        <p>© ${new Date().getFullYear()} CortexCloud. All rights reserved.</p>
        <p>
          <a href="${import.meta.env.VITE_APP_URL}/settings/notifications">Email Preferences</a> |
          <a href="${import.meta.env.VITE_APP_URL}/privacy">Privacy Policy</a>
        </p>
      </div>
    </body>
    </html>
  `;
};