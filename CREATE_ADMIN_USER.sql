-- Create Admin User - Run this in Supabase SQL Editor

-- First, let's check if any users exist
SELECT COUNT(*) as total_users FROM users;

-- Check if admin already exists
SELECT * FROM users WHERE role = 'ADMIN';

-- Create admin user with proper password hash
-- Password: Admin1234!
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
  '$2a$12$cWtUvM95oyU2GSF2kCsWrelizE6VJ0.fWAoVI9X4xS2TmdXDB5afe',
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
