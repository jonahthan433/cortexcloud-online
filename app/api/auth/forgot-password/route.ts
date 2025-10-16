import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuthRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success } = await checkAuthRateLimit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    // This is a security best practice
    const response = {
      success: true,
      message: 'If an account exists with that email, you will receive a password reset link.',
    };

    if (!user) {
      // Still return success but don't send email
      return NextResponse.json(response, { status: 200 });
    }

    // Check if user has password (not OAuth only)
    if (!user.password_hash) {
      // Still return success but don't send email
      return NextResponse.json(response, { status: 200 });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // TODO: Store reset token in database
    // You may want to create a separate table for password reset tokens
    // For now, we'll just log it
    console.log('Password reset token for', email, ':', resetToken);
    console.log('Reset link:', `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`);

    // TODO: Send password reset email
    // await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}

