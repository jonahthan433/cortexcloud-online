-- Trial management enhancements

-- Add paid_subscription_starts_at and trial_reminder_sent to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS paid_subscription_starts_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_reminder_sent BOOLEAN DEFAULT false;

-- Create trial expiration notifications tracking table
CREATE TABLE IF NOT EXISTS trial_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- '3_days_left', '1_day_left', 'expired'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, type)
);

-- Enable RLS for trial_notifications
ALTER TABLE trial_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for trial_notifications
CREATE POLICY "Allow users to read own trial notifications" ON trial_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow admins full access to trial notifications" ON trial_notifications
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to check trial status
CREATE OR REPLACE FUNCTION check_trial_status(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    user_record users%ROWTYPE;
BEGIN
    -- Get user record
    SELECT * INTO user_record FROM users WHERE id = user_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'status', 'error',
            'message', 'User not found'
        );
    END IF;

    -- If user hasn't started trial
    IF NOT user_record.trial_started THEN
        RETURN jsonb_build_object(
            'status', 'not_started',
            'message', 'Trial not started'
        );
    END IF;

    -- If trial has expired and no paid subscription
    IF user_record.trial_expires_at < NOW() AND 
       (user_record.paid_subscription_starts_at IS NULL OR user_record.paid_subscription_starts_at > NOW()) THEN
        RETURN jsonb_build_object(
            'status', 'expired',
            'message', 'Trial period has expired',
            'expired_at', user_record.trial_expires_at
        );
    END IF;

    -- If trial is active
    IF user_record.trial_expires_at >= NOW() THEN
        RETURN jsonb_build_object(
            'status', 'active',
            'message', 'Trial is active',
            'expires_at', user_record.trial_expires_at,
            'days_remaining', EXTRACT(DAY FROM (user_record.trial_expires_at - NOW()))::INTEGER
        );
    END IF;

    -- If paid subscription has started
    IF user_record.paid_subscription_starts_at <= NOW() THEN
        RETURN jsonb_build_object(
            'status', 'subscribed',
            'message', 'Paid subscription active',
            'subscription_started', user_record.paid_subscription_starts_at
        );
    END IF;

    -- Fallback
    RETURN jsonb_build_object(
        'status', 'unknown',
        'message', 'Unable to determine trial status'
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to send trial expiration reminder
CREATE OR REPLACE FUNCTION send_trial_expiration_reminder(
    p_user_id UUID,
    p_notification_type VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    user_record users%ROWTYPE;
    notification_exists BOOLEAN;
BEGIN
    -- Check if notification already sent
    SELECT EXISTS (
        SELECT 1 FROM trial_notifications 
        WHERE user_id = p_user_id AND type = p_notification_type
    ) INTO notification_exists;

    IF notification_exists THEN
        RETURN false;
    END IF;

    -- Get user record
    SELECT * INTO user_record FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;

    -- Insert notification record
    INSERT INTO trial_notifications (user_id, type)
    VALUES (p_user_id, p_notification_type);

    -- Update trial_reminder_sent flag for user
    UPDATE users SET trial_reminder_sent = true WHERE id = p_user_id;

    -- Return success
    RETURN true;
END;
$$ LANGUAGE plpgsql;