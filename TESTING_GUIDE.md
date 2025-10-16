# 🧪 Testing Guide - CortexCloud Authentication System

## Overview
This guide provides comprehensive testing procedures for the authentication and user management system to ensure production readiness.

---

## 🚀 Quick Start Testing

### Prerequisites
1. Database is running and migrated
2. Environment variables are set (see `.env.nextjs.example`)
3. Application is running locally (`npm run dev`)
4. Email service is configured (for welcome emails)

---

## 📋 Manual Testing Checklist

### 1. User Signup Flow ✅

#### Test Case 1.1: Successful Signup
**Steps:**
1. Navigate to `/signup`
2. Fill in all required fields:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "Test1234" (meets requirements)
   - Company: "Test Company" (optional)
3. Check "I agree to terms" checkbox
4. Click "Create account"

**Expected Results:**
- ✅ Account created successfully
- ✅ User automatically logged in
- ✅ Redirected to `/dashboard`
- ✅ Welcome email sent (check console/email)
- ✅ Trial started (14 days)
- ✅ Toast notification shows success

**Database Verification:**
```sql
SELECT id, email, name, password_hash, trial_started, trial_expires_at 
FROM users 
WHERE email = 'testuser@example.com';
```
- ✅ User exists in database
- ✅ password_hash is not null (bcrypt hash)
- ✅ trial_started = true
- ✅ trial_expires_at is 14 days from now

---

#### Test Case 1.2: Duplicate Email
**Steps:**
1. Try to signup with same email as Test 1.1

**Expected Results:**
- ✅ Error message: "User with this email already exists"
- ✅ Status code: 400
- ✅ No new user created in database

---

#### Test Case 1.3: Password Validation
**Steps:**
1. Try passwords that don't meet requirements:
   - "test" (too short)
   - "testtest" (no uppercase or number)
   - "Test" (too short)

**Expected Results:**
- ✅ Error messages shown for each invalid password
- ✅ Clear requirements displayed
- ✅ Form not submitted

---

#### Test Case 1.4: Email Validation
**Steps:**
1. Try invalid emails:
   - "notanemail"
   - "test@"
   - "@example.com"

**Expected Results:**
- ✅ Email validation error shown
- ✅ Form not submitted

---

#### Test Case 1.5: Rate Limiting
**Steps:**
1. Submit signup form 6 times rapidly

**Expected Results:**
- ✅ First 5 attempts processed
- ✅ 6th attempt returns 429 (Too Many Requests)
- ✅ Error: "Too many requests. Please try again later."

---

### 2. User Login Flow ✅

#### Test Case 2.1: Successful Login (Credentials)
**Steps:**
1. Navigate to `/login`
2. Enter credentials from Test 1.1:
   - Email: "testuser@example.com"
   - Password: "Test1234"
3. Click "Sign in"

**Expected Results:**
- ✅ Successfully authenticated
- ✅ Redirected to `/dashboard`
- ✅ Session created (check cookies)
- ✅ User data loaded in session

**Session Verification:**
```javascript
// In browser console on /dashboard
fetch('/api/user')
  .then(r => r.json())
  .then(console.log);
```
- ✅ User data returned
- ✅ Correct email and name
- ✅ Trial information present

---

#### Test Case 2.2: Invalid Password
**Steps:**
1. Navigate to `/login`
2. Enter correct email but wrong password

**Expected Results:**
- ✅ Error: "Invalid email or password"
- ✅ Not authenticated
- ✅ Remains on login page

---

#### Test Case 2.3: Non-existent User
**Steps:**
1. Try to login with email that doesn't exist

**Expected Results:**
- ✅ Error: "Invalid email or password"
- ✅ Same error as wrong password (security best practice)

---

#### Test Case 2.4: OAuth User Attempting Credentials Login
**Steps:**
1. Create account via Google OAuth
2. Try to login with same email using credentials

**Expected Results:**
- ✅ Error: "Please sign in with OAuth provider"
- ✅ Clear message about using OAuth

---

#### Test Case 2.5: Rate Limiting on Login
**Steps:**
1. Try to login with wrong password 6 times

**Expected Results:**
- ✅ First 5 attempts show "Invalid password"
- ✅ 6th attempt returns 429 (Too Many Requests)
- ✅ Must wait 15 minutes before trying again

---

### 3. OAuth Login Flow ✅

#### Test Case 3.1: Google OAuth Signup
**Steps:**
1. Navigate to `/signup`
2. Click "Google" button
3. Complete Google OAuth flow

**Expected Results:**
- ✅ Redirected to Google login
- ✅ OAuth consent screen shown
- ✅ After consent, redirected back to app
- ✅ User created in database
- ✅ Redirected to `/dashboard`
- ✅ Trial started automatically

**Database Verification:**
```sql
SELECT id, email, name, password_hash 
FROM users 
WHERE email = '[google-email]';
```
- ✅ User exists
- ✅ password_hash is NULL (OAuth user)

---

#### Test Case 3.2: Google OAuth Login (Existing User)
**Steps:**
1. Login again with same Google account

**Expected Results:**
- ✅ Existing user found
- ✅ No duplicate user created
- ✅ Successfully logged in
- ✅ Redirected to `/dashboard`

---

#### Test Case 3.3: GitHub OAuth
**Steps:**
1. Repeat Tests 3.1 and 3.2 with GitHub

**Expected Results:**
- ✅ Same behavior as Google OAuth

---

### 4. Protected Routes ✅

#### Test Case 4.1: Access Dashboard Without Login
**Steps:**
1. Logout if logged in
2. Navigate to `/dashboard`

**Expected Results:**
- ✅ Redirected to `/login?callbackUrl=/dashboard`
- ✅ Cannot access dashboard
- ✅ After login, redirected back to dashboard

---

#### Test Case 4.2: Access Admin Page as Regular User
**Steps:**
1. Login as regular user
2. Navigate to `/admin`

**Expected Results:**
- ✅ Redirected to `/dashboard`
- ✅ Cannot access admin area
- ✅ Only ADMIN or SUPER_ADMIN role can access

---

#### Test Case 4.3: Access Login Page While Authenticated
**Steps:**
1. Login as user
2. Navigate to `/login`

**Expected Results:**
- ✅ Redirected to `/dashboard`
- ✅ Cannot access login page when authenticated

---

### 5. API Endpoint Security ✅

#### Test Case 5.1: Protected API Without Auth
**Steps:**
```bash
curl http://localhost:3000/api/user
```

**Expected Results:**
- ✅ Status: 401 Unauthorized
- ✅ Error: "Unauthorized"

---

#### Test Case 5.2: Protected API With Auth
**Steps:**
1. Login to get session
2. Call API from authenticated browser:
```javascript
fetch('/api/user')
  .then(r => r.json())
  .then(console.log);
```

**Expected Results:**
- ✅ Status: 200
- ✅ User data returned
- ✅ Includes subscription info

---

### 6. Input Validation & Sanitization ✅

#### Test Case 6.1: XSS Prevention
**Steps:**
1. Try to signup with name containing HTML/JavaScript:
   - Name: `<script>alert('xss')</script>`
   - Name: `<img src=x onerror=alert('xss')>`

**Expected Results:**
- ✅ HTML tags removed/escaped
- ✅ No script execution
- ✅ Clean data stored in database

---

#### Test Case 6.2: SQL Injection Prevention
**Steps:**
1. Try to signup with email containing SQL:
   - Email: `test'; DROP TABLE users; --@example.com`

**Expected Results:**
- ✅ Email validation fails (invalid format)
- ✅ Even if it passes validation, Prisma prevents SQL injection
- ✅ No database damage

---

#### Test Case 6.3: Long Input Handling
**Steps:**
1. Try to signup with very long strings:
   - Name: 200 characters
   - Email: 300 characters
   - Company: 200 characters

**Expected Results:**
- ✅ Validation errors for too-long inputs
- ✅ Maximum lengths enforced
- ✅ Clear error messages

---

### 7. Session Management ✅

#### Test Case 7.1: Session Persistence
**Steps:**
1. Login
2. Close browser
3. Reopen browser
4. Navigate to `/dashboard`

**Expected Results:**
- ✅ Still logged in (within 30 days)
- ✅ Session restored from JWT

---

#### Test Case 7.2: Session Expiry
**Steps:**
1. Login
2. Wait 30 days (or manually expire JWT)
3. Try to access protected route

**Expected Results:**
- ✅ Redirected to login
- ✅ Session expired
- ✅ Must login again

---

#### Test Case 7.3: Logout
**Steps:**
1. Login
2. Navigate to `/dashboard`
3. Click logout
4. Try to access `/dashboard`

**Expected Results:**
- ✅ Session cleared
- ✅ Redirected to login
- ✅ Cannot access protected routes

---

## 🔧 Automated Testing

### Setup
```bash
npm install
npm run test
```

### Unit Tests (Vitest)

Create `lib/__tests__/validation.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isStrongPassword,
  sanitizeEmail,
  sanitizeInput,
} from '../validation';

describe('Validation', () => {
  describe('isValidEmail', () => {
    it('accepts valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('accepts strong passwords', () => {
      expect(isStrongPassword('Test1234')).toBe(true);
      expect(isStrongPassword('MyP@ssw0rd')).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(isStrongPassword('test')).toBe(false); // too short
      expect(isStrongPassword('testtest')).toBe(false); // no uppercase/number
      expect(isStrongPassword('TEST1234')).toBe(false); // no lowercase
    });
  });

  describe('sanitizeEmail', () => {
    it('trims and lowercases email', () => {
      expect(sanitizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
    });
  });

  describe('sanitizeInput', () => {
    it('removes dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>'))
        .not.toContain('<script>');
    });
  });
});
```

Run tests:
```bash
npm run test
```

---

### E2E Tests (Playwright)

Create `tests/e2e/auth-flow.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('complete signup and login flow', async ({ page }) => {
    // Generate unique email
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    
    // 1. Signup
    await page.goto('/signup');
    await page.fill('[id="name"]', 'Test User');
    await page.fill('[id="email"]', email);
    await page.fill('[id="password"]', 'Test1234');
    await page.click('[id="terms"]');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // 2. Logout
    await page.click('[aria-label="User menu"]');
    await page.click('text=Logout');
    
    // 3. Login
    await page.goto('/login');
    await page.fill('[id="email"]', email);
    await page.fill('[id="password"]', 'Test1234');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[id="email"]', 'wrong@example.com');
    await page.fill('[id="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });
});
```

Run E2E tests:
```bash
npm run test:e2e
```

---

## 🔐 Security Testing

### 1. Rate Limiting Test
```bash
# Install hey (HTTP load generator)
# macOS: brew install hey
# Linux: go install github.com/rakyll/hey@latest

# Test auth rate limiting (should block after 5 attempts)
hey -n 10 -c 1 -m POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}' \
  http://localhost:3000/api/auth/callback/credentials
```

**Expected:** First 5 requests succeed, rest return 429

---

### 2. Password Security Test
```bash
# Verify bcrypt is used (not plain text)
# Connect to database and check password_hash format
psql $SUPABASE_DB_URL -c "SELECT email, password_hash FROM users LIMIT 1;"
```

**Expected:** password_hash starts with `$2b$12$` (bcrypt with 12 rounds)

---

### 3. Session Security Test
```javascript
// In browser console
document.cookie.split(';').forEach(c => console.log(c.trim()));
```

**Expected:** 
- ✅ `next-auth.session-token` cookie present
- ✅ `HttpOnly` flag set
- ✅ `Secure` flag set (in production)
- ✅ `SameSite=Lax` or `SameSite=Strict`

---

## 📊 Performance Testing

### Load Test Signup Endpoint
```bash
# Test 100 concurrent signups
hey -n 100 -c 10 -m POST -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test1234"}' \
  http://localhost:3000/api/auth/signup
```

**Expected:**
- ✅ Average response time < 500ms
- ✅ No failed requests (except duplicates)
- ✅ Rate limiting working properly

---

## ✅ Pre-Production Checklist

Before deploying to production:

### Database
- [ ] Migrations applied successfully
- [ ] Password hash column exists
- [ ] Indexes created for performance
- [ ] Backup strategy in place

### Security
- [ ] All environment variables set
- [ ] NextAuth secret is strong and unique
- [ ] Rate limiting enabled (Upstash Redis)
- [ ] CORS configured for production domain
- [ ] HTTPS enabled
- [ ] Security headers configured

### Authentication
- [ ] Signup works with all edge cases
- [ ] Login works (credentials + OAuth)
- [ ] Password validation enforced
- [ ] Rate limiting prevents brute force
- [ ] Sessions persist correctly
- [ ] Protected routes work
- [ ] Logout works

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Logging enabled for auth events
- [ ] Alerts set up for failed logins
- [ ] Analytics tracking signups

### Email
- [ ] Welcome email sends successfully
- [ ] Email service configured (Resend/SendGrid)
- [ ] From address verified
- [ ] Email templates tested

---

## 🐛 Troubleshooting

### Issue: Signup returns 500 error
**Check:**
1. Database is running
2. SUPABASE_DB_URL is correct
3. Prisma client generated (`npx prisma generate`)
4. Migration applied

### Issue: Login always fails
**Check:**
1. Password_hash column exists in database
2. Password was saved during signup
3. Bcrypt comparison working
4. Check server logs for errors

### Issue: OAuth doesn't work
**Check:**
1. OAuth provider credentials set
2. Redirect URLs configured correctly
3. NEXTAUTH_URL is correct
4. NEXTAUTH_SECRET is set

### Issue: Rate limiting not working
**Check:**
1. UPSTASH_REDIS_REST_URL set
2. UPSTASH_REDIS_REST_TOKEN set
3. Redis instance is active
4. No placeholder values in env vars

---

## 📞 Support

If tests fail or you encounter issues:
1. Check logs: `npm run dev` output
2. Check database: Connect to PostgreSQL and verify data
3. Check environment: Ensure all vars are set
4. Check network: Ensure services are reachable
5. Review SECURITY_AUDIT_REPORT.md for common issues

---

**Testing Complete!** ✅

Once all tests pass, your authentication system is production-ready.

