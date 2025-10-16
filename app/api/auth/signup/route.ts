import { NextRequest, NextResponse } from 'next/server';
import { prisma, createUser, startTrial } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';
import { checkAuthRateLimit } from '@/lib/rate-limit';
import { signupSchema, sanitizeEmail, sanitizeInput } from '@/lib/validation';
import bcrypt from 'bcryptjs';

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
    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, company } = validationResult.data;

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedCompany = company ? sanitizeInput(company) : undefined;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with password hash
    const user = await createUser({
      email: sanitizedEmail,
      name: sanitizedName,
      company: sanitizedCompany,
      password_hash: passwordHash,
    });

    // Start trial automatically
    await startTrial(user.id);

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(sanitizedEmail, sanitizedName).catch((error) =>
      console.error('Failed to send welcome email:', error)
    );

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}


