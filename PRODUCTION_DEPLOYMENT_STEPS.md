# 🚀 Production Deployment Steps - CortexCloud

## Overview
This guide provides step-by-step instructions to deploy your CortexCloud SaaS application to production with all security fixes applied.

---

## ✅ Pre-Deployment Checklist

### Code Changes Applied
- [x] Added `password_hash` field to User model
- [x] Fixed signup flow to save password hashes
- [x] Fixed login authentication to verify passwords
- [x] Consolidated NextAuth configuration
- [x] Added comprehensive input validation
- [x] Created database migration
- [x] Added security features (rate limiting, sanitization)
- [x] Created documentation (Security Audit, Testing Guide)

---

## 🗄️ Step 1: Database Migration

### Option A: Using Prisma (Recommended for Development)

```bash
# 1. Generate Prisma client with new schema
npx prisma generate

# 2. Push schema changes to database
npx prisma db push

# 3. Verify the change
npx prisma studio
# Check that User model has password_hash field
```

### Option B: Using SQL Migration (Recommended for Production)

```bash
# 1. Connect to your Supabase/PostgreSQL database
psql $SUPABASE_DB_URL

# 2. Run the migration
\i supabase/migrations/20241016_add_password_hash.sql

# 3. Verify
\d users
# You should see password_hash column

# 4. Exit
\q
```

### Option C: Supabase Dashboard
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Copy contents of `supabase/migrations/20241016_add_password_hash.sql`
4. Run the SQL
5. Verify in Table Editor

---

## 🔧 Step 2: Environment Configuration

### 1. Create Production Environment File

```bash
# Copy the production example
cp .env.production.example .env

# Or for Next.js specific
cp env.nextjs.example .env
```

### 2. Fill in ALL Required Values

**Critical - No Placeholders Allowed:**

```bash
# Generate NextAuth Secret (CRITICAL!)
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET

# Your production values:
NEXT_PUBLIC_APP_URL=https://cortexcloud.online
NEXTAUTH_URL=https://cortexcloud.online
NEXTAUTH_SECRET=[paste-generated-secret-here]

# Database
SUPABASE_DB_URL=[your-supabase-connection-string]

# OAuth (from Google Cloud Console & GitHub Settings)
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]
GITHUB_CLIENT_ID=[your-github-client-id]
GITHUB_CLIENT_SECRET=[your-github-client-secret]

# Stripe (LIVE keys for production!)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your-key]
STRIPE_SECRET_KEY=sk_live_[your-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-webhook-secret]

# Email Service (Resend recommended)
RESEND_API_KEY=re_[your-resend-key]
RESEND_FROM_EMAIL=noreply@cortexcloud.online

# Rate Limiting (HIGHLY RECOMMENDED)
UPSTASH_REDIS_REST_URL=https://[your-redis-url].upstash.io
UPSTASH_REDIS_REST_TOKEN=[your-redis-token]
```

### 3. Verify Environment Variables

```bash
# Check all required vars are set
node -e "
const required = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'SUPABASE_DB_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];
required.forEach(v => {
  if (!process.env[v] || process.env[v].includes('your_')) {
    console.error('❌ Missing or placeholder:', v);
  } else {
    console.log('✅', v);
  }
});
"
```

---

## 🔐 Step 3: OAuth Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select Project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://cortexcloud.online/api/auth/callback/google
   ```
6. Copy Client ID and Secret to `.env`

### GitHub OAuth Setup

1. Go to [GitHub Settings → Developer settings](https://github.com/settings/developers)
2. New OAuth App
3. Application name: CortexCloud
4. Homepage URL: `https://cortexcloud.online`
5. Authorization callback URL: `https://cortexcloud.online/api/auth/callback/github`
6. Copy Client ID and Secret to `.env`

---

## 💳 Step 4: Stripe Configuration

### 1. Switch to Live Mode
- Toggle to "Live" mode in Stripe Dashboard

### 2. Get API Keys
- Developers → API Keys
- Copy Publishable key (pk_live_...)
- Copy Secret key (sk_live_...)

### 3. Create Products & Prices
```
Product: Starter
Price: $29/month → Copy price ID to STRIPE_PRICE_STARTER

Product: Professional  
Price: $99/month → Copy price ID to STRIPE_PRICE_PROFESSIONAL

Product: Business
Price: $299/month → Copy price ID to STRIPE_PRICE_BUSINESS
```

### 4. Configure Webhook
1. Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://cortexcloud.online/api/stripe/webhook`
3. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy Signing secret to `STRIPE_WEBHOOK_SECRET`

---

## 📧 Step 5: Email Service Setup

### Option A: Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Add domain: cortexcloud.online
3. Add DNS records (provided by Resend)
4. Verify domain
5. Create API key
6. Add to `.env` as `RESEND_API_KEY`

### Option B: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify sender identity
3. Create API key
4. Add to `.env` as `SENDGRID_API_KEY`

---

## 🛡️ Step 6: Rate Limiting Setup (Critical for Production)

### Upstash Redis Setup

1. Sign up at [console.upstash.com](https://console.upstash.com/)
2. Create new database
3. Choose region close to your app
4. Copy REST URL and Token
5. Add to `.env`:
   ```
   UPSTASH_REDIS_REST_URL=https://[your-id].upstash.io
   UPSTASH_REDIS_REST_TOKEN=[your-token]
   ```

**Why This Is Critical:**
- Prevents brute force attacks on login
- Limits signup spam
- Protects API from abuse
- Free tier is generous (10K requests/day)

---

## 🚀 Step 7: Build & Deploy

### Local Production Test

```bash
# 1. Build the application
npm run build

# 2. Test production build locally
npm run start

# 3. Test authentication flow
# - Signup a new user
# - Login with that user
# - Test OAuth providers
# - Verify protected routes work
```

### Deploy to Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod

# 4. Add environment variables in Vercel Dashboard:
# Project Settings → Environment Variables
# Add ALL variables from your .env file
```

### Deploy to Other Platforms

**Netlify:**
```bash
netlify deploy --prod
```

**AWS/Docker:**
```dockerfile
# Use Node 18+
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

---

## ✅ Step 8: Post-Deployment Verification

### 1. Health Checks

```bash
# Check app is accessible
curl https://cortexcloud.online

# Check API endpoints
curl https://cortexcloud.online/api/health

# Check database connection
curl https://cortexcloud.online/api/db-check
```

### 2. Test Authentication Flow

#### Signup Test
1. Go to https://cortexcloud.online/signup
2. Create test account
3. Verify:
   - ✅ Account created
   - ✅ Welcome email received
   - ✅ Redirected to dashboard
   - ✅ Trial started

#### Login Test
1. Logout
2. Go to https://cortexcloud.online/login
3. Login with test account
4. Verify:
   - ✅ Successfully logged in
   - ✅ Redirected to dashboard
   - ✅ Session persists after page refresh

#### OAuth Test
1. Test Google login
2. Test GitHub login
3. Verify both work

### 3. Security Verification

```bash
# Check security headers
curl -I https://cortexcloud.online

# Should include:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

### 4. Database Verification

```bash
# Connect to production database
psql $SUPABASE_DB_URL

# Verify test user exists
SELECT id, email, name, password_hash IS NOT NULL as has_password
FROM users
WHERE email = 'your-test@email.com';

# Should show:
# - User exists
# - has_password = true
```

---

## 📊 Step 9: Monitoring Setup

### 1. Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs

# Add SENTRY_DSN to .env
```

### 2. Analytics (Google Analytics)

```javascript
// Add to .env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

// Already integrated in app/layout.tsx
```

### 3. Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- New Relic
- Datadog

Monitor:
- https://cortexcloud.online
- https://cortexcloud.online/api/health
- Database connection

---

## 🎯 Step 10: Launch Checklist

Before announcing your app:

### Security ✅
- [ ] All environment variables set (no placeholders)
- [ ] HTTPS enabled (SSL certificate)
- [ ] Rate limiting active
- [ ] Security headers configured
- [ ] CORS set to production domain only
- [ ] Database backups enabled
- [ ] Passwords properly hashed

### Functionality ✅
- [ ] Signup works (credentials + OAuth)
- [ ] Login works (credentials + OAuth)
- [ ] Password validation enforced
- [ ] Email delivery working
- [ ] Protected routes working
- [ ] Trial activation working
- [ ] Stripe payment working

### Monitoring ✅
- [ ] Error tracking active (Sentry)
- [ ] Analytics working (GA)
- [ ] Uptime monitoring active
- [ ] Log aggregation setup
- [ ] Alerts configured

### Performance ✅
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images optimized
- [ ] Database queries optimized

### Legal ✅
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Cookie consent (if EU users)
- [ ] GDPR compliance (if applicable)

---

## 🐛 Troubleshooting

### "NEXTAUTH_SECRET is not set"
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env and redeploy
```

### "Database connection failed"
```bash
# Test connection
psql $SUPABASE_DB_URL -c "SELECT 1;"

# Verify URL format:
# postgresql://user:pass@host:5432/dbname
```

### "OAuth redirect_uri_mismatch"
1. Check OAuth provider settings
2. Ensure redirect URI matches exactly:
   - `https://cortexcloud.online/api/auth/callback/google`
   - No trailing slash
   - Correct protocol (https)

### "Rate limiting not working"
1. Verify Upstash credentials
2. Check Redis instance is active
3. Test connection:
```bash
curl $UPSTASH_REDIS_REST_URL/ping \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
```

### "Emails not sending"
1. Check email service API key
2. Verify sender domain
3. Check spam folder
4. Review email service logs

---

## 🎉 Success!

Once all steps are complete and verified:

1. ✅ Your app is securely deployed
2. ✅ Users can create accounts
3. ✅ Authentication is secure
4. ✅ Monitoring is active
5. ✅ You're ready to accept clients!

---

## 📞 Next Steps

1. **Announce launch** to beta users
2. **Monitor closely** for first 48 hours
3. **Collect feedback** and iterate
4. **Review analytics** daily
5. **Schedule regular security audits** (monthly)

---

## 📚 Additional Resources

- [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md) - Complete security analysis
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing procedures
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - General deployment info
- [PRODUCTION_READINESS_GUIDE.md](./PRODUCTION_READINESS_GUIDE.md) - Best practices

---

**Deployment Complete!** 🚀

Your CortexCloud SaaS application is now production-ready and secure for client account creation.

For support or questions, review the documentation or check the troubleshooting section above.

**Good luck with your launch!** 🎊

