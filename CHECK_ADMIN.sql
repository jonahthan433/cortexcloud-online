-- Check if admin user exists and what their current role is
SELECT id, email, name, role, subscription_tier, created_at 
FROM users 
WHERE email = 'admin@cortexcloud.online';
