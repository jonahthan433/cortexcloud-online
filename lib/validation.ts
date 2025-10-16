import { z } from 'zod';

// Common validation schemas for the application

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(3, 'Email must be at least 3 characters')
  .max(255, 'Email must be less than 255 characters')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .trim();

export const companySchema = z
  .string()
  .min(2, 'Company name must be at least 2 characters')
  .max(100, 'Company name must be less than 100 characters')
  .trim()
  .optional();

// Auth schemas
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  company: companySchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// User update schema
export const userUpdateSchema = z.object({
  name: nameSchema.optional(),
  company: companySchema,
  avatar: z.string().url('Invalid avatar URL').optional(),
});

// Workspace schemas
export const workspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters').max(100),
  settings: z.record(z.any()).optional(),
});

// Workflow schemas
export const workflowSchema = z.object({
  name: z.string().min(2, 'Workflow name must be at least 2 characters').max(100),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  steps: z.array(z.any()),
  triggers: z.record(z.any()).optional(),
});

// Document schemas
export const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required').max(255),
  type: z.string(),
  content: z.string().optional(),
  file_url: z.string().url('Invalid file URL').optional(),
});

// API Key schemas
export const apiKeySchema = z.object({
  name: z.string().min(2, 'API key name must be at least 2 characters').max(100),
  permissions: z.record(z.any()),
  expires_at: z.date().optional(),
});

// Sanitization helpers
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Validation helpers
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isValidEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}

export function isStrongPassword(password: string): boolean {
  try {
    passwordSchema.parse(password);
    return true;
  } catch {
    return false;
  }
}

// XSS prevention
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// SQL injection prevention helper (Prisma handles this, but good to have)
export function sanitizeSqlInput(input: string): string {
  return input.replace(/['";\\]/g, '');
}

