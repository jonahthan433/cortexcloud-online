export const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
export const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
export const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') ?? '';

// Type definition for error responses
export interface ErrorResponse {
  error: string;
  details?: unknown;
}

// Type definition for SendGrid error details
export interface SendGridErrorDetails {
  recipient: string;
  template?: string;
  subject?: string;
  message?: string;
}

// Helper to create error response
export function createErrorResponse(message: string, details?: unknown): Response {
  const error: ErrorResponse = {
    error: message,
    details
  };
  return new Response(JSON.stringify(error), {
    status: 500,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Helper to create success response
export function createSuccessResponse<T>(data: T): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
if (!SENDGRID_API_KEY) throw new Error('Missing SENDGRID_API_KEY');