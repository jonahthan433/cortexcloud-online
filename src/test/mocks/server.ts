import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock Supabase responses
export const handlers = [
  // Auth endpoints
  http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
          company: 'Test Company'
        }
      }
    });
  }),

  http.post('https://test.supabase.co/auth/v1/signup', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
          company: 'Test Company'
        }
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      }
    });
  }),

  // Database endpoints
  http.get('https://test.supabase.co/rest/v1/availability', () => {
    return HttpResponse.json([
      {
        id: '1',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '17:00',
        is_available: true
      }
    ]);
  }),

  http.get('https://test.supabase.co/rest/v1/bookings', () => {
    return HttpResponse.json([
      {
        id: '1',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '+1234567890',
        booking_date: '2024-01-15',
        booking_time: '10:00',
        status: 'confirmed',
        notes: 'Test booking'
      }
    ]);
  }),

  // Google API endpoints
  http.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', () => {
    return HttpResponse.json({
      items: [
        {
          id: '1',
          summary: 'Test Event',
          start: { dateTime: '2024-01-15T10:00:00Z' },
          end: { dateTime: '2024-01-15T11:00:00Z' }
        }
      ]
    });
  }),

  // Email service endpoints
  http.post('https://api.emailservice.com/send', () => {
    return HttpResponse.json({
      success: true,
      messageId: 'mock-message-id'
    });
  }),

  // Payment endpoints
  http.post('https://api.stripe.com/v1/payment_intents', () => {
    return HttpResponse.json({
      id: 'pi_test_123',
      client_secret: 'pi_test_123_secret',
      status: 'requires_payment_method'
    });
  }),

  // Catch all for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled request: ${request.method} ${request.url}`);
    return HttpResponse.json({ error: 'Unhandled request' }, { status: 404 });
  })
];

export const server = setupServer(...handlers);
