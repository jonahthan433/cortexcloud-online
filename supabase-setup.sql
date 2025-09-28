-- Supabase Database Setup for Cortex Cloud Booking System
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'confirmed',
    google_calendar_event_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    company VARCHAR(255),
    trial_started BOOLEAN DEFAULT false,
    trial_expires_at TIMESTAMP WITH TIME ZONE,
    plan VARCHAR(50) DEFAULT 'trial',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activation_tokens table
CREATE TABLE IF NOT EXISTS activation_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_leads table
CREATE TABLE IF NOT EXISTS email_leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    source VARCHAR(100) DEFAULT 'hero_section',
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to check booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
    p_booking_date DATE,
    p_booking_time TIME,
    p_duration_minutes INTEGER DEFAULT 30,
    p_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_exists BOOLEAN := FALSE;
    booking_end_time TIME;
BEGIN
    -- Calculate end time
    booking_end_time := p_booking_time + (p_duration_minutes || ' minutes')::INTERVAL;
    
    -- Check for overlapping bookings
    SELECT EXISTS(
        SELECT 1 
        FROM bookings 
        WHERE booking_date = p_booking_date
        AND status = 'confirmed'
        AND (p_booking_id IS NULL OR id != p_booking_id)
        AND (
            -- New booking starts during existing booking
            (p_booking_time >= booking_time AND p_booking_time < booking_time + (duration_minutes || ' minutes')::INTERVAL)
            OR
            -- New booking ends during existing booking
            (booking_end_time > booking_time AND booking_end_time <= booking_time + (duration_minutes || ' minutes')::INTERVAL)
            OR
            -- New booking completely contains existing booking
            (p_booking_time <= booking_time AND booking_end_time >= booking_time + (duration_minutes || ' minutes')::INTERVAL)
        )
    ) INTO conflict_exists;
    
    RETURN conflict_exists;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_availability_updated_at 
    BEFORE UPDATE ON availability 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_leads_updated_at
    BEFORE UPDATE ON email_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activation_tokens_updated_at
    BEFORE UPDATE ON activation_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default availability (Monday to Friday, 9 AM to 5 PM)
INSERT INTO availability (day_of_week, start_time, end_time, is_available) VALUES
(1, '09:00', '17:00', true),  -- Monday
(2, '09:00', '17:00', true),  -- Tuesday
(3, '09:00', '17:00', true),  -- Wednesday
(4, '09:00', '17:00', true),  -- Thursday
(5, '09:00', '17:00', true)   -- Friday
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(booking_date, booking_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_availability_day ON availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_activation_tokens_token ON activation_tokens(token);
CREATE INDEX IF NOT EXISTS idx_activation_tokens_email ON activation_tokens(email);

-- Set up Row Level Security (RLS)
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to availability" ON availability
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to bookings" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to bookings" ON bookings
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to email_leads" ON email_leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to read own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow public insert to users" ON users
    FOR INSERT WITH CHECK (true);

-- Create policies for admin access (you'll need to set up authentication)
CREATE POLICY "Allow admin full access to availability" ON availability
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to bookings" ON bookings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to admin_users" ON admin_users
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to users" ON users
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to email_leads" ON email_leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public insert to activation_tokens" ON activation_tokens
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read activation_tokens" ON activation_tokens
    FOR SELECT USING (true);

CREATE POLICY "Allow public update activation_tokens" ON activation_tokens
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin full access to activation_tokens" ON activation_tokens
    FOR ALL USING (auth.role() = 'authenticated');

-- Create a function to send booking confirmation email (placeholder)
CREATE OR REPLACE FUNCTION send_booking_confirmation(
    p_name VARCHAR,
    p_email VARCHAR,
    p_phone VARCHAR,
    p_booking_date DATE,
    p_booking_time TIME,
    p_notes TEXT,
    p_booking_id UUID
)
RETURNS JSON AS $$
BEGIN
    -- This is a placeholder function
    -- In a real implementation, you would integrate with an email service
    -- like SendGrid, Mailgun, or use Supabase Edge Functions
    
    RETURN json_build_object(
        'success', true,
        'message', 'Booking confirmation email would be sent here',
        'booking_id', p_booking_id
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to send welcome email (placeholder)
CREATE OR REPLACE FUNCTION send_welcome_email(
    p_email VARCHAR,
    p_lead_id UUID
)
RETURNS JSON AS $$
BEGIN
    -- This is a placeholder function
    -- In a real implementation, you would integrate with an email service
    -- like SendGrid, Mailgun, or use Supabase Edge Functions
    
    RETURN json_build_object(
        'success', true,
        'message', 'Welcome email would be sent here',
        'lead_id', p_lead_id
    );
END;
$$ LANGUAGE plpgsql;
