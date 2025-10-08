-- Create email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE,
    description text,
    html_content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create email logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient varchar(255) NOT NULL,
    template varchar(255) NOT NULL,
    subject varchar(255) NOT NULL,
    status varchar(50) NOT NULL,
    error text,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- Add index for email logs queries
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);

-- Insert default email templates
INSERT INTO public.email_templates (name, description, html_content) VALUES
('activation', 'Account activation email template', '{{emailContent}}'),
('welcome', 'Welcome email after account activation', '{{emailContent}}')
ON CONFLICT (name) DO UPDATE
SET html_content = EXCLUDED.html_content,
    updated_at = now();

-- Update activation_tokens table
ALTER TABLE IF EXISTS public.activation_tokens
ADD COLUMN IF NOT EXISTS used_at timestamptz,
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
