// scripts/create-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminEmail = 'admin@cortexcloud.online';
    const adminPassword = 'Admin1234!';
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'System Administrator',
        password_hash: passwordHash,
        role: 'ADMIN',
        subscription_tier: 'ENTERPRISE',
        trial_started: true,
        trial_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 User ID:', adminUser.id);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
