import { z } from 'zod';

const envSchema = z.object({
  // Application Configuration
  VITE_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // Supabase Configuration
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_PROJECT_ID: z.string().min(1),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),

  // Google OAuth Configuration
  VITE_GOOGLE_CLIENT_ID: z.string().min(1),
  VITE_GOOGLE_CLIENT_SECRET: z.string().min(1),
  VITE_GOOGLE_REDIRECT_URI: z.string().url(),

  // API Keys and Services
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  VITE_SLACK_CLIENT_ID: z.string().optional(),
  VITE_WHATSAPP_BUSINESS_ID: z.string().optional(),

  // Calendar Integration
  VITE_CALENDAR_API_KEY: z.string().min(1),
  VITE_CALENDAR_INTEGRATION_TYPE: z.enum(['google', 'outlook', 'ical']),
  VITE_CALENDAR_SYNC_INTERVAL: z.string().transform(Number).pipe(z.number().min(60)),

  // Email Service Configuration
  VITE_EMAIL_SERVICE: z.enum(['supabase_edge', 'sendgrid', 'ses']),
  VITE_EMAIL_FROM: z.string().email(),
  VITE_EMAIL_REPLY_TO: z.string().email(),

  // Feature Flags
  VITE_ENABLE_WHATSAPP: z.enum(['true', 'false']).transform(v => v === 'true'),
  VITE_ENABLE_SLACK: z.enum(['true', 'false']).transform(v => v === 'true'),
  VITE_ENABLE_VIDEO_CALLS: z.enum(['true', 'false']).transform(v => v === 'true'),

  // Performance and Optimization
  VITE_ENABLE_PWA: z.enum(['true', 'false']).transform(v => v === 'true'),
  VITE_CACHE_TTL: z.string().transform(Number).pipe(z.number().min(0)),
  VITE_MAX_UPLOAD_SIZE: z.string().transform(Number).pipe(z.number().min(0)),

  // Deployment and Infrastructure
  VITE_DEPLOYMENT_REGION: z.string().min(1),
  VITE_CDN_URL: z.string().url().optional(),
  VITE_API_BASE_URL: z.string().url()
});

export type Env = z.infer<typeof envSchema>;

function validateEnv() {
  try {
    const parsed = envSchema.safeParse(import.meta.env);

    if (!parsed.success) {
      console.error('❌ Invalid environment variables:', parsed.error.format());
      throw new Error('Invalid environment variables');
    }

    return parsed.data;
  } catch (error) {
    console.error('❌ Error validating environment variables:', error);
    throw error;
  }
}

export const env = validateEnv();