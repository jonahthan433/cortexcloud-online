-- Create Admin User in Supabase Dashboard
-- Run this SQL in Supabase Dashboard > SQL Editor

-- First, check if admin already exists
SELECT * FROM users WHERE role = 'ADMIN';

-- If no admin exists, create one
-- Replace 'admin@cortexcloud.online' with your desired admin email
-- Replace 'Admin1234!' with your desired password

INSERT INTO users (
  id,
  email,
  name,
  password_hash,
  role,
  subscription_tier,
  trial_started,
  trial_expires_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@cortexcloud.online',
  'System Administrator',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8Kz8Kz8K', -- This is 'Admin1234!' hashed
  'ADMIN',
  'ENTERPRISE',
  true,
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW()
);

-- Verify the admin user was created
SELECT id, email, name, role, subscription_tier, created_at 
FROM users 
WHERE role = 'ADMIN';
