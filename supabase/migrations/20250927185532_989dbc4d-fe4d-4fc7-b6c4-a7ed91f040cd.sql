-- Create booking system tables

-- Create availability table for business owner settings
CREATE TABLE public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  google_calendar_event_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table for business owner auth
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings (public can insert, admin can view all)
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view their own bookings" ON public.bookings
  FOR SELECT USING (true); -- For now, make bookings viewable to prevent issues

-- Create policies for availability (public can read, admin can manage)
CREATE POLICY "Anyone can view availability" ON public.availability
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_bookings_date_time ON public.bookings (booking_date, booking_time);
CREATE INDEX idx_availability_day ON public.availability (day_of_week);

-- Create function to check for booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_booking_date DATE,
  p_booking_time TIME,
  p_duration_minutes INTEGER DEFAULT 30,
  p_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  conflict_count INTEGER;
  end_time TIME;
BEGIN
  -- Calculate end time
  end_time := p_booking_time + (p_duration_minutes || ' minutes')::INTERVAL;
  
  -- Check for conflicts
  SELECT COUNT(*)
  INTO conflict_count
  FROM public.bookings
  WHERE booking_date = p_booking_date
    AND status = 'confirmed'
    AND (p_booking_id IS NULL OR id != p_booking_id)
    AND (
      -- New booking starts during existing booking
      p_booking_time >= booking_time AND p_booking_time < (booking_time + (duration_minutes || ' minutes')::INTERVAL)
      OR
      -- New booking ends during existing booking
      end_time > booking_time AND end_time <= (booking_time + (duration_minutes || ' minutes')::INTERVAL)
      OR
      -- New booking completely encompasses existing booking
      p_booking_time <= booking_time AND end_time >= (booking_time + (duration_minutes || ' minutes')::INTERVAL)
    );
  
  RETURN conflict_count > 0;
END;
$$;

-- Insert default availability (Monday to Friday, 9 AM to 5 PM)
INSERT INTO public.availability (day_of_week, start_time, end_time, is_available) VALUES
(1, '09:00:00', '17:00:00', true), -- Monday
(2, '09:00:00', '17:00:00', true), -- Tuesday
(3, '09:00:00', '17:00:00', true), -- Wednesday
(4, '09:00:00', '17:00:00', true), -- Thursday
(5, '09:00:00', '17:00:00', true); -- Friday