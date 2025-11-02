// scripts/update-admin-password.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    const password = 'Admin1234!';
    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.user.update({
      where: { email: 'admin@cortexcloud.online' },
      data: {
        password_hash: passwordHash,
        role: 'ADMIN',
        subscription_tier: 'ENTERPRISE',
      },
    });

    console.log('✅ Admin password updated successfully!');
    console.log('Email:', admin.email);
    console.log('Password: Admin1234!');
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
