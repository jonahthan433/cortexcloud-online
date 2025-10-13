# CortexCloud Next.js Deployment Guide

Complete guide for deploying CortexCloud to production.

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] All environment variables set
- [ ] Production API keys configured
- [ ] Database connection string updated
- [ ] NextAuth secret generated
- [ ] Stripe webhook endpoint configured
- [ ] OpenAI API key set
- [ ] Email service configured

### 2. Database Setup
- [ ] Prisma schema synced to production database
- [ ] Migrations applied
- [ ] Indexes created
- [ ] Backup strategy in place

### 3. Stripe Configuration
- [ ] Products created in Stripe
- [ ] Price IDs configured
- [ ] Webhook endpoint added
- [ ] Test mode disabled
- [ ] Customer portal configured

### 4. Security
- [ ] Rate limiting configured
- [ ] CORS settings verified
- [ ] Security headers enabled
- [ ] SSL certificate active
- [ ] API keys encrypted

## 🚀 Deployment to Vercel (Recommended)

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project settings:
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 3: Environment Variables

Add all environment variables in Vercel dashboard:

```env
# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://cortexcloud.online
NEXT_PUBLIC_APP_NAME=CortexCloud

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=https://cortexcloud.online
NEXTAUTH_SECRET=your_secure_production_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret

# Stripe (Production Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_BUSINESS=price_...

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@cortexcloud.online

# Upstash Redis (Optional)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### Step 4: Database Setup

```bash
# Push schema to production database
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

### Step 5: Deploy

Click "Deploy" in Vercel dashboard. First deployment takes 2-5 minutes.

### Step 6: Configure Custom Domain

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records:
   - Add `A` record or `CNAME` as instructed
4. Wait for DNS propagation (up to 48 hours)

### Step 7: Set Up Webhooks

#### Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://cortexcloud.online/api/stripe/webhooks`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to Vercel environment variables

## 🐳 Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: cortexcloud
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Deploy with Docker

```bash
# Build image
docker build -t cortexcloud:latest .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

## 🔧 Post-Deployment Configuration

### 1. Verify Deployment

Test critical paths:
- [ ] Homepage loads
- [ ] User registration works
- [ ] Login works
- [ ] Dashboard accessible
- [ ] Workflow creation works
- [ ] Document upload works
- [ ] Stripe checkout works
- [ ] Webhooks receiving events

### 2. Set Up Monitoring

#### Vercel Analytics
Enable in Project Settings > Analytics

#### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add to `.env.production`:
```env
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

#### Uptime Monitoring
- UptimeRobot
- Pingdom
- StatusCake

### 3. Performance Optimization

#### Enable Edge Functions
In `middleware.ts`:
```ts
export const config = {
  runtime: 'edge',
};
```

#### Configure CDN
Vercel automatically handles this, but verify:
- Static assets cached
- Images optimized
- Edge caching enabled

### 4. Backup Strategy

#### Database Backups
```bash
# Daily automated backups
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Upload to S3 or similar
aws s3 cp backup-*.sql s3://your-backup-bucket/
```

#### Prisma Snapshots
```bash
npx prisma migrate resolve --rolled-back "migration_name"
```

## 🔒 Security Hardening

### 1. Environment Variables
- Never commit secrets
- Use different secrets for dev/prod
- Rotate keys regularly

### 2. Rate Limiting
Ensure rate limits are active:
```typescript
// Test rate limit
curl -X POST https://cortexcloud.online/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
```

### 3. Security Headers
Verify in `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ];
}
```

### 4. HTTPS Enforcement
Vercel handles this automatically, but verify:
```bash
curl -I http://cortexcloud.online
# Should redirect to https://
```

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Error rates in Sentry
- [ ] API response times
- [ ] Database performance
- [ ] Disk usage
- [ ] Memory usage

### Weekly Tasks
- [ ] Review logs
- [ ] Check Stripe dashboard
- [ ] Review user feedback
- [ ] Update dependencies
- [ ] Security patches

### Monthly Tasks
- [ ] Database optimization
- [ ] Backup verification
- [ ] Cost analysis
- [ ] Performance review
- [ ] Security audit

## 🚨 Rollback Procedure

If deployment fails:

### Vercel
1. Go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

### Docker
```bash
# Rollback to previous image
docker-compose down
docker-compose up -d --scale app=0
docker tag cortexcloud:previous cortexcloud:latest
docker-compose up -d
```

### Database Rollback
```bash
# Restore from backup
psql $DATABASE_URL < backup-20240101.sql

# Or use Prisma
npx prisma migrate resolve --rolled-back "migration_name"
```

## 📞 Support

If you encounter issues:
- Check logs: `vercel logs` or `docker-compose logs`
- Review environment variables
- Verify database connectivity
- Check Stripe webhook logs
- Contact support@cortexcloud.online

---

## ✅ Deployment Complete!

Your CortexCloud instance should now be live at https://cortexcloud.online

Next steps:
1. Monitor first users
2. Set up analytics
3. Configure backup schedule
4. Enable monitoring alerts
5. Document any custom configurations


