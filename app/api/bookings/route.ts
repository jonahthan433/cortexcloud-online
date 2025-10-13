import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Service is required'),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = bookingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, service, date, time, notes } = validationResult.data;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        service,
        date: new Date(date),
        time,
        notes,
        status: 'pending',
      },
    });

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: `Booking Confirmation - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e40af;">Booking Confirmed!</h1>
          <p>Hi ${name},</p>
          <p>Your appointment has been successfully scheduled.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Appointment Details</h2>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          
          <p>We'll send you a calendar invite shortly. If you need to reschedule, please reply to this email.</p>
          
          <p>Looking forward to speaking with you!</p>
          <p>The CortexCloud Team</p>
        </div>
      `,
      text: `Booking Confirmed! ${service} on ${date} at ${time}`,
    });

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          date: booking.date,
          time: booking.time,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}


