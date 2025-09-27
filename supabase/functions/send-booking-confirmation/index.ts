import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Using a simple fetch for emails since resend npm package has dependency issues
const sendEmail = async (emailData: any) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });
  
  if (!response.ok) {
    throw new Error(`Email sending failed: ${response.statusText}`);
  }
  
  return response.json();
};



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  name: string;
  email: string;
  phone?: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
  booking_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      phone, 
      booking_date, 
      booking_time, 
      notes, 
      booking_id 
    }: BookingConfirmationRequest = await req.json();

    console.log("Sending booking confirmation email for:", { name, email, booking_date, booking_time });

    // Format the date for better readability
    const formattedDate = new Date(booking_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Convert 24-hour time to 12-hour format
    const [hours, minutes] = booking_time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formattedTime = `${displayHour}:${minutes} ${ampm}`;

    // Send confirmation email to customer
    const customerEmailResponse = await sendEmail({
      from: "Booking System <onboarding@resend.dev>",
      to: [email],
      subject: "Booking Confirmation - Your Appointment is Confirmed!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #00bcd4; text-align: center;">Your Appointment is Confirmed!</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Booking Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <p><strong>Booking ID:</strong> ${booking_id}</p>
          </div>

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">What's Next?</h3>
            <p>We look forward to meeting with you! Please arrive a few minutes early for your appointment.</p>
            <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible.</p>
          </div>

          <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
            Thank you for choosing our services!
          </p>
        </div>
      `,
    });

    // Send notification email to business owner
    const ownerEmailResponse = await sendEmail({
      from: "Booking System <onboarding@resend.dev>",
      to: ["business@example.com"], // Replace with actual business email
      subject: `New Booking: ${name} - ${formattedDate} at ${formattedTime}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #d32f2f; text-align: center;">New Booking Received</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Customer Information</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <p><strong>Booking ID:</strong> ${booking_id}</p>
          </div>

          <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f57c00; margin-top: 0;">Action Required</h3>
            <p>A new appointment has been scheduled. Please add this to your calendar and prepare for the meeting.</p>
          </div>
        </div>
      `,
    });

    console.log("Customer email sent successfully:", customerEmailResponse);
    console.log("Owner email sent successfully:", ownerEmailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      customer_email: customerEmailResponse,
      owner_email: ownerEmailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);