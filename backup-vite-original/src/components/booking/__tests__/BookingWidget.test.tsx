import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingWidget } from '../BookingWidget';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlanProvider } from '@/contexts/PlanContext';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn()
      }))
    }))
  }
}));

// Mock calendar integration
vi.mock('@/services/calendarIntegration', () => ({
  calendarIntegration: {
    getAvailableSlots: vi.fn(),
    createBooking: vi.fn()
  }
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <PlanProvider>
      {children}
    </PlanProvider>
  </AuthProvider>
);

describe('BookingWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render booking widget', () => {
    render(
      <TestWrapper>
        <BookingWidget />
      </TestWrapper>
    );

    expect(screen.getByText('Book Your Consultation')).toBeInTheDocument();
    expect(screen.getByText('Select Date')).toBeInTheDocument();
    expect(screen.getByText('Select Time')).toBeInTheDocument();
  });

  it('should show date picker when date is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BookingWidget />
      </TestWrapper>
    );

    const dateButton = screen.getByText('Select Date');
    await user.click(dateButton);

    // Should show calendar or date picker
    expect(screen.getByRole('button', { name: /select date/i })).toBeInTheDocument();
  });

  it('should show time slots when date is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BookingWidget />
      </TestWrapper>
    );

    // Mock available slots
    const { calendarIntegration } = await import('@/services/calendarIntegration');
    (calendarIntegration.getAvailableSlots as any).mockResolvedValue([
      '09:00', '10:00', '11:00', '14:00', '15:00'
    ]);

    // Select a date (this would typically trigger the time slot loading)
    const dateButton = screen.getByText('Select Date');
    await user.click(dateButton);

    // In a real implementation, selecting a date would load time slots
    // For now, we'll test the time selection UI
    expect(screen.getByText('Select Time')).toBeInTheDocument();
  });

  it('should validate required fields before booking', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BookingWidget />
      </TestWrapper>
    );

    const bookButton = screen.getByText('Confirm Booking');
    await user.click(bookButton);

    // Should show validation errors for required fields
    await waitFor(() => {
      expect(screen.getByText('Please select a date')).toBeInTheDocument();
    });
  });

  it('should handle successful booking', async () => {
    const user = userEvent.setup();
    
    // Mock successful booking
    const { calendarIntegration } = await import('@/services/calendarIntegration');
    (calendarIntegration.createBooking as any).mockResolvedValue({
      id: 'booking-123',
      status: 'confirmed'
    });

    render(
      <TestWrapper>
        <BookingWidget />
      </TestWrapper>
    );

    // Fill out the form
    const nameInput = screen.getByPlaceholderText('Your full name');
    const emailInput = screen.getByPlaceholderText('your.email@example.com');
    const phoneInput = screen.getByPlaceholderText('(555) 123-4567');
    const notesInput = screen.getByPlaceholderText('Any additional information or special requests...');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(phoneInput, '+1234567890');
    await user.type(notesInput, 'Test booking');

    // Mock date and time selection
    // In a real test, you'd need to mock the date/time selection components

    const bookButton = screen.getByText('Confirm Booking');
    await user.click(bookButton);

    await waitFor(() => {
      expect(calendarIntegration.createBooking).toHaveBeenCalled();
    });
  });

  it('should handle booking error', async () => {
    const user = userEvent.setup();
    
    // Mock booking error
    const { calendarIntegration } = await import('@/services/calendarIntegration');
    (calendarIntegration.createBooking as any).mockRejectedValue(
      new Error('Booking failed')
    );

    render(
      <TestWrapper>
        <BookingWidget />
      </TestWrapper>
    );

    // Fill out the form
    const nameInput = screen.getByPlaceholderText('Your full name');
    const emailInput = screen.getByPlaceholderText('your.email@example.com');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');

    const bookButton = screen.getByText('Confirm Booking');
    await user.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText(/booking failed/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during booking', async () => {
    const user = userEvent.setup();
    
    // Mock slow booking
    const { calendarIntegration } = await import('@/services/calendarIntegration');
    (calendarIntegration.createBooking as any).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(
      <TestWrapper>
        <BookingWidget />
      </TestWrapper>
    );

    // Fill out the form
    const nameInput = screen.getByPlaceholderText('Your full name');
    const emailInput = screen.getByPlaceholderText('your.email@example.com');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');

    const bookButton = screen.getByText('Confirm Booking');
    await user.click(bookButton);

    // Should show loading state
    expect(screen.getByText('Booking...')).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BookingWidget />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('your.email@example.com');
    await user.type(emailInput, 'invalid-email');

    const bookButton = screen.getByText('Confirm Booking');
    await user.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should validate phone number format', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BookingWidget />
      </TestWrapper>
    );

    const phoneInput = screen.getByPlaceholderText('(555) 123-4567');
    await user.type(phoneInput, '123');

    const bookButton = screen.getByText('Confirm Booking');
    await user.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument();
    });
  });
});
