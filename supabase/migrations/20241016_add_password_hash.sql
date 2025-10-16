-- Add password_hash column to users table for credentials-based authentication
-- This is optional and will be NULL for OAuth users

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add index on password_hash existence for query optimization
CREATE INDEX IF NOT EXISTS idx_users_has_password ON users(password_hash) 
WHERE password_hash IS NOT NULL;

-- Add comment to column
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password for credentials-based authentication. NULL for OAuth users.';

