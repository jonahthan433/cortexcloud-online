// scripts/generate-admin-hash.js
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Admin1234!';
  const hash = await bcrypt.hash(password, 12);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('');
  console.log('SQL to insert admin user:');
  console.log(`
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
  '${hash}',
  'ADMIN',
  'ENTERPRISE',
  true,
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW()
);
  `);
}

generateHash().catch(console.error);
