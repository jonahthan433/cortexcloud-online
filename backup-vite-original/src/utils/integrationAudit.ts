import { logger } from './logger';

export interface IntegrationConfig {
  name: string;
  type: 'api' | 'oauth' | 'webhook' | 'database' | 'payment' | 'email' | 'analytics';
  endpoint?: string;
  credentials: {
    required: string[];
    optional?: string[];
  };
  healthCheck: {
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    expectedStatus?: number;
    timeout?: number;
  };
  rateLimit?: {
    requests: number;
    window: number; // in seconds
  };
  retryConfig?: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

export interface IntegrationStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  lastChecked: Date;
  responseTime?: number;
  error?: string;
  details?: Record<string, any>;
}

export class IntegrationAuditor {
  private integrations: Map<string, IntegrationConfig> = new Map();
  private statuses: Map<string, IntegrationStatus> = new Map();

  constructor() {
    this.initializeIntegrations();
  }

  private initializeIntegrations() {
    // Supabase Integration
    this.addIntegration({
      name: 'supabase',
      type: 'database',
      endpoint: import.meta.env.VITE_SUPABASE_URL,
      credentials: {
        required: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY']
      },
      healthCheck: {
        endpoint: '/rest/v1/',
        method: 'GET',
        expectedStatus: 200,
        timeout: 5000
      },
      rateLimit: {
        requests: 1000,
        window: 60
      }
    });

    // Google APIs Integration
    this.addIntegration({
      name: 'google-apis',
      type: 'oauth',
      endpoint: 'https://www.googleapis.com',
      credentials: {
        required: ['VITE_GOOGLE_CLIENT_ID'],
        optional: ['GOOGLE_CLIENT_SECRET']
      },
      healthCheck: {
        endpoint: '/oauth2/v1/tokeninfo',
        method: 'GET',
        expectedStatus: 200,
        timeout: 10000
      },
      rateLimit: {
        requests: 100,
        window: 100
      }
    });

    // Stripe Integration
    this.addIntegration({
      name: 'stripe',
      type: 'payment',
      endpoint: 'https://api.stripe.com',
      credentials: {
        required: ['VITE_STRIPE_PUBLISHABLE_KEY'],
        optional: ['STRIPE_SECRET_KEY']
      },
      healthCheck: {
        endpoint: '/v1/account',
        method: 'GET',
        expectedStatus: 200,
        timeout: 10000
      },
      rateLimit: {
        requests: 100,
        window: 1
      }
    });

    // Email Service Integration
    this.addIntegration({
      name: 'email-service',
      type: 'email',
      endpoint: import.meta.env.VITE_EMAIL_SERVICE_URL,
      credentials: {
        required: ['VITE_EMAIL_SERVICE_URL', 'VITE_EMAIL_API_KEY']
      },
      healthCheck: {
        endpoint: '/health',
        method: 'GET',
        expectedStatus: 200,
        timeout: 5000
      },
      rateLimit: {
        requests: 1000,
        window: 60
      }
    });

    // Analytics Integration
    this.addIntegration({
      name: 'analytics',
      type: 'analytics',
      endpoint: 'https://www.google-analytics.com',
      credentials: {
        required: ['VITE_GA_MEASUREMENT_ID']
      },
      healthCheck: {
        endpoint: '/gtag/js',
        method: 'GET',
        expectedStatus: 200,
        timeout: 5000
      }
    });
  }

  addIntegration(config: IntegrationConfig): void {
    this.integrations.set(config.name, config);
  }

  async auditAllIntegrations(): Promise<IntegrationStatus[]> {
    const results: IntegrationStatus[] = [];
    
    for (const [name, config] of this.integrations) {
      try {
        const status = await this.auditIntegration(name);
        results.push(status);
      } catch (error) {
        logger.error(`Failed to audit integration ${name}`, error as Error);
        results.push({
          name,
          status: 'unknown',
          lastChecked: new Date(),
          error: (error as Error).message
        });
      }
    }

    return results;
  }

  async auditIntegration(name: string): Promise<IntegrationStatus> {
    const config = this.integrations.get(name);
    if (!config) {
      throw new Error(`Integration ${name} not found`);
    }

    const startTime = Date.now();
    let status: IntegrationStatus = {
      name,
      status: 'unknown',
      lastChecked: new Date()
    };

    try {
      // Check credentials
      const credentialStatus = this.checkCredentials(config);
      if (!credentialStatus.valid) {
        status.status = 'unhealthy';
        status.error = `Missing credentials: ${credentialStatus.missing.join(', ')}`;
        this.statuses.set(name, status);
        return status;
      }

      // Perform health check
      if (config.healthCheck.endpoint) {
        const healthStatus = await this.performHealthCheck(config);
        status = { ...status, ...healthStatus };
      } else {
        status.status = 'healthy';
        status.details = { message: 'No health check configured' };
      }

      // Calculate response time
      status.responseTime = Date.now() - startTime;

      // Log audit result
      logger.info(`Integration audit completed: ${name}`, {
        status: status.status,
        responseTime: status.responseTime,
        integration: name
      });

    } catch (error) {
      status.status = 'unhealthy';
      status.error = (error as Error).message;
      status.responseTime = Date.now() - startTime;

      logger.error(`Integration audit failed: ${name}`, error as Error, {
        integration: name,
        responseTime: status.responseTime
      });
    }

    this.statuses.set(name, status);
    return status;
  }

  private checkCredentials(config: IntegrationConfig): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const credential of config.credentials.required) {
      const value = import.meta.env[credential];
      if (!value || value.includes('placeholder')) {
        missing.push(credential);
      }
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }

  private async performHealthCheck(config: IntegrationConfig): Promise<Partial<IntegrationStatus>> {
    const { healthCheck } = config;
    const url = `${config.endpoint}${healthCheck.endpoint}`;
    const method = healthCheck.method || 'GET';
    const timeout = healthCheck.timeout || 5000;
    const expectedStatus = healthCheck.expectedStatus || 200;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(config.name === 'stripe' && {
            'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`
          })
        }
      });

      clearTimeout(timeoutId);

      if (response.status === expectedStatus) {
        return {
          status: 'healthy',
          details: {
            statusCode: response.status,
            statusText: response.statusText
          }
        };
      } else {
        return {
          status: 'degraded',
          error: `Expected status ${expectedStatus}, got ${response.status}`,
          details: {
            statusCode: response.status,
            statusText: response.statusText
          }
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          status: 'unhealthy',
          error: `Health check timed out after ${timeout}ms`
        };
      }

      return {
        status: 'unhealthy',
        error: (error as Error).message
      };
    }
  }

  getIntegrationStatus(name: string): IntegrationStatus | undefined {
    return this.statuses.get(name);
  }

  getAllStatuses(): IntegrationStatus[] {
    return Array.from(this.statuses.values());
  }

  getHealthyIntegrations(): IntegrationStatus[] {
    return this.getAllStatuses().filter(status => status.status === 'healthy');
  }

  getUnhealthyIntegrations(): IntegrationStatus[] {
    return this.getAllStatuses().filter(status => status.status === 'unhealthy');
  }

  getDegradedIntegrations(): IntegrationStatus[] {
    return this.getAllStatuses().filter(status => status.status === 'degraded');
  }

  // Test integration functionality
  async testIntegration(name: string, testData?: any): Promise<{ success: boolean; result?: any; error?: string }> {
    const config = this.integrations.get(name);
    if (!config) {
      return { success: false, error: `Integration ${name} not found` };
    }

    try {
      switch (name) {
        case 'supabase':
          return await this.testSupabaseIntegration(testData);
        case 'google-apis':
          return await this.testGoogleApisIntegration(testData);
        case 'stripe':
          return await this.testStripeIntegration(testData);
        case 'email-service':
          return await this.testEmailServiceIntegration(testData);
        default:
          return { success: false, error: `No test implemented for ${name}` };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async testSupabaseIntegration(testData?: any): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      // Test database connection
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''}`
        }
      });

      if (response.ok) {
        return { success: true, result: 'Database connection successful' };
      } else {
        return { success: false, error: `Database connection failed: ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async testGoogleApisIntegration(testData?: any): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      // Test OAuth configuration
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || clientId.includes('placeholder')) {
        return { success: false, error: 'Google Client ID not configured' };
      }

      return { success: true, result: 'Google OAuth configuration valid' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async testStripeIntegration(testData?: any): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      // Test Stripe configuration
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey || publishableKey.includes('placeholder')) {
        return { success: false, error: 'Stripe publishable key not configured' };
      }

      // Test if it's a valid Stripe key format
      if (!publishableKey.startsWith('pk_')) {
        return { success: false, error: 'Invalid Stripe publishable key format' };
      }

      return { success: true, result: 'Stripe configuration valid' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async testEmailServiceIntegration(testData?: any): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      const emailServiceUrl = import.meta.env.VITE_EMAIL_SERVICE_URL;
      const emailApiKey = import.meta.env.VITE_EMAIL_API_KEY;

      if (!emailServiceUrl || emailServiceUrl.includes('placeholder')) {
        return { success: false, error: 'Email service URL not configured' };
      }

      if (!emailApiKey || emailApiKey.includes('placeholder')) {
        return { success: false, error: 'Email API key not configured' };
      }

      // Test email service health
      const response = await fetch(`${emailServiceUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${emailApiKey}`
        }
      });

      if (response.ok) {
        return { success: true, result: 'Email service connection successful' };
      } else {
        return { success: false, error: `Email service health check failed: ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Generate integration report
  generateReport(): string {
    const statuses = this.getAllStatuses();
    const healthy = this.getHealthyIntegrations();
    const unhealthy = this.getUnhealthyIntegrations();
    const degraded = this.getDegradedIntegrations();

    let report = `# Integration Audit Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- Total Integrations: ${statuses.length}\n`;
    report += `- Healthy: ${healthy.length}\n`;
    report += `- Degraded: ${degraded.length}\n`;
    report += `- Unhealthy: ${unhealthy.length}\n\n`;

    if (unhealthy.length > 0) {
      report += `## Unhealthy Integrations\n\n`;
      unhealthy.forEach(integration => {
        report += `### ${integration.name}\n`;
        report += `- Status: ${integration.status}\n`;
        report += `- Error: ${integration.error}\n`;
        report += `- Last Checked: ${integration.lastChecked.toISOString()}\n\n`;
      });
    }

    if (degraded.length > 0) {
      report += `## Degraded Integrations\n\n`;
      degraded.forEach(integration => {
        report += `### ${integration.name}\n`;
        report += `- Status: ${integration.status}\n`;
        report += `- Error: ${integration.error}\n`;
        report += `- Response Time: ${integration.responseTime}ms\n`;
        report += `- Last Checked: ${integration.lastChecked.toISOString()}\n\n`;
      });
    }

    report += `## All Integrations\n\n`;
    statuses.forEach(integration => {
      report += `### ${integration.name}\n`;
      report += `- Status: ${integration.status}\n`;
      if (integration.responseTime) {
        report += `- Response Time: ${integration.responseTime}ms\n`;
      }
      if (integration.error) {
        report += `- Error: ${integration.error}\n`;
      }
      report += `- Last Checked: ${integration.lastChecked.toISOString()}\n\n`;
    });

    return report;
  }
}

// Create singleton instance
export const integrationAuditor = new IntegrationAuditor();

// Utility functions
export const auditAllIntegrations = () => integrationAuditor.auditAllIntegrations();
export const getIntegrationStatus = (name: string) => integrationAuditor.getIntegrationStatus(name);
export const testIntegration = (name: string, testData?: any) => integrationAuditor.testIntegration(name, testData);
export const generateIntegrationReport = () => integrationAuditor.generateReport();
