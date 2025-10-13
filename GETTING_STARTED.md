# 🚀 Getting Started with CortexCloud Next.js

Welcome to your new Next.js 14+ implementation of CortexCloud! This guide will help you get up and running.

## 📁 What's Been Created

### Complete File Structure

```
cortexcloud-nextjs/
├── app/                              # Next.js App Router
│   ├── (auth)/                      # ✅ Authentication Pages
│   │   ├── login/page.tsx          
│   │   └── signup/page.tsx         
│   ├── (dashboard)/                 # ✅ Dashboard Pages (All Original Features)
│   │   ├── layout.tsx              # Sidebar navigation
│   │   └── dashboard/
│   │       ├── page.tsx            # Dashboard home
│   │       ├── crm/page.tsx        # CRM & Pipeline
│   │       ├── automation/page.tsx # Automation builder
│   │       ├── workflows/          # Workflow management
│   │       │   ├── page.tsx        
│   │       │   └── new/page.tsx    
│   │       ├── documents/page.tsx  # Document processing
│   │       ├── calendar/page.tsx   # Calendar & appointments
│   │       ├── communications/page.tsx  # All-in-one messaging
│   │       ├── analytics/page.tsx  # Analytics dashboard
│   │       ├── team/page.tsx       # Team management
│   │       ├── integrations/page.tsx   # Integrations marketplace
│   │       ├── billing/page.tsx    # Billing & subscriptions
│   │       └── settings/page.tsx   # Account settings
│   ├── (marketing)/                 # ✅ Marketing Pages
│   │   ├── layout.tsx              
│   │   ├── page.tsx                # Landing page
│   │   ├── pricing/page.tsx        # Pricing with FAQ
│   │   ├── features/page.tsx       # Feature showcase
│   │   ├── about/page.tsx          # About us
│   │   ├── contact/page.tsx        # Contact form
│   │   ├── docs/page.tsx           # Documentation hub
│   │   ├── blog/                   
│   │   │   ├── page.tsx            # Blog listing
│   │   │   └── [slug]/page.tsx     # Blog post
│   │   └── booking/page.tsx        # Booking page
│   ├── admin/page.tsx               # ✅ Admin dashboard
│   ├── api/                         # ✅ API Routes
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── signup/route.ts
│   │   ├── user/route.ts
│   │   ├── workflows/
│   │   │   ├── route.ts            # List, create
│   │   │   └── [id]/
│   │   │       ├── route.ts        # Get, update, delete
│   │   │       ├── run/route.ts    # Execute workflow
│   │   │       └── logs/route.ts   # Execution logs
│   │   ├── documents/
│   │   │   ├── route.ts            # List
│   │   │   ├── upload/route.ts     # Upload & process
│   │   │   └── [id]/route.ts       # Get, delete
│   │   ├── stripe/
│   │   │   ├── create-checkout-session/route.ts
│   │   │   ├── create-portal-session/route.ts
│   │   │   └── webhooks/route.ts
│   │   ├── billing/
│   │   │   ├── usage/route.ts
│   │   │   └── subscription/route.ts
│   │   ├── analytics/
│   │   │   └── overview/route.ts
│   │   ├── team/route.ts
│   │   └── bookings/route.ts
│   ├── layout.tsx                   # Root layout with providers
│   ├── globals.css                  # Global styles
│   ├── sitemap.ts                   # SEO sitemap
│   └── robots.ts                    # SEO robots.txt
│
├── components/                       # ✅ React Components
│   ├── layout/
│   │   ├── Navbar.tsx              # Navigation bar
│   │   └── Footer.tsx              # Footer
│   └── ui/                          # Shadcn/ui components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── textarea.tsx
│       └── ... (more UI components)
│
├── lib/                              # ✅ Core Libraries
│   ├── prisma.ts                    # Prisma client + utilities
│   ├── stripe.ts                    # Stripe integration
│   ├── openai.ts                    # OpenAI integration
│   ├── email.ts                     # Email service (Resend)
│   ├── auth.ts                      # NextAuth configuration
│   ├── rate-limit.ts                # Rate limiting
│   ├── rbac.ts                      # Access control
│   ├── utils.ts                     # Utility functions
│   └── stores/                      # Zustand stores
│       ├── auth-store.ts
│       ├── workspace-store.ts
│       ├── workflow-store.ts
│       ├── document-store.ts
│       ├── ui-store.ts
│       └── billing-store.ts
│
├── prisma/                           # ✅ Database
│   └── schema.prisma                # Complete schema (15+ models)
│
├── middleware.ts                     # ✅ Route protection
├── next.config.js                    # ✅ Next.js configuration
├── package-nextjs.json               # ✅ Dependencies
├── tsconfig-nextjs.json              # ✅ TypeScript config
├── tailwind.config.ts                # Tailwind configuration
├── env.nextjs.example                # ✅ Environment template
│
└── Documentation/
    ├── README-NEXTJS.md              # Main documentation
    ├── DEPLOYMENT_GUIDE_NEXTJS.md    # Deployment instructions
    ├── MIGRATION_GUIDE.md            # Migration from Vite
    ├── IMPLEMENTATION_SUMMARY.md     # What's built
    ├── COMPLETE_IMPLEMENTATION_SUMMARY.md  # Full feature list
    └── GETTING_STARTED.md            # This file
```

## 🛠️ Installation Steps

### Step 1: Review Files

All new Next.js files have been created with these naming patterns:
- `package-nextjs.json` → Rename to `package.json`
- `tsconfig-nextjs.json` → Rename to `tsconfig.json`
- `env.nextjs.example` → Copy to `.env.local`

### Step 2: Backup & Rename

```bash
# Backup old files
mv package.json package-vite.json.bak
mv tsconfig.json tsconfig-vite.json.bak

# Use new Next.js files
mv package-nextjs.json package.json
mv tsconfig-nextjs.json tsconfig.json
```

### Step 3: Install Dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json

# Install all dependencies
npm install

# This will install:
# - Next.js 15.1.6
# - NextAuth.js 5.0
# - Prisma 5.22.0
# - Stripe, OpenAI, Resend
# - Zustand, React Query
# - All existing dependencies
```

### Step 4: Environment Setup

```bash
# Copy environment template
cp env.nextjs.example .env.local

# Edit .env.local with your values
```

**Required Values:**

```env
# Critical - Must set these
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET=your_random_secret_here

# Get from Google Cloud Console
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Optional but recommended for full features
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
```

### Step 5: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Open Prisma Studio to view database
npx prisma studio
```

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎯 Features Available

### ✅ All Original Dashboard Features
1. **CRM & Pipeline** - Contact management, lead tracking
2. **Automation Builder** - Create and manage automations
3. **Workflows** - Visual workflow management
4. **Documents** - Upload and AI processing
5. **Calendar** - Appointment scheduling
6. **Communications** - Multi-platform messaging
7. **Analytics** - Business intelligence
8. **Team** - Member management
9. **Integrations** - Third-party connections
10. **Billing** - Subscription management
11. **Settings** - Account configuration

### ✅ New Features Added
1. **Stripe Payments** - Full subscription system
2. **OpenAI Integration** - Document processing, workflow suggestions
3. **Email System** - Automated notifications
4. **Marketing Pages** - Pricing, features, about, contact, blog
5. **Admin Dashboard** - System management
6. **Booking System** - Appointment scheduling
7. **API Infrastructure** - Complete REST API
8. **Security** - RBAC, rate limiting, audit logs

## 📱 Testing the Application

### Test User Registration

1. Go to `/signup`
2. Fill in the form
3. Check database in Prisma Studio
4. Verify welcome email (if Resend configured)

### Test Dashboard Access

1. Login at `/login`
2. Navigate to `/dashboard`
3. Explore all tabs:
   - Overview (stats and metrics)
   - CRM (contact management)
   - Automation (workflow automations)
   - Workflows (create and manage)
   - Documents (upload and process)
   - Calendar (appointments)
   - Communications (messaging)
   - Analytics (charts and reports)
   - Team (member management)
   - Integrations (connect services)
   - Billing (subscription management)
   - Settings (account preferences)

### Test Workflows

1. Go to `/dashboard/workflows`
2. Click "Create Workflow"
3. Fill in details
4. View in list
5. Try to run a workflow (basic execution implemented)

### Test Documents

1. Go to `/dashboard/documents`
2. Upload a file
3. Watch status change (if OpenAI configured)
4. View processed data

## 🔧 Configuration Guides

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### Stripe Setup

1. Create [Stripe Account](https://stripe.com)
2. Get API keys from Dashboard
3. Create Products:
   - Professional: $49/month
   - Business: $149/month
4. Copy Price IDs to `.env.local`
5. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhooks`
   - Events: subscription.*, invoice.*

### OpenAI Setup

1. Create [OpenAI Account](https://platform.openai.com)
2. Generate API key
3. Add to `.env.local`
4. Monitor usage in OpenAI dashboard

### Resend Setup

1. Create [Resend Account](https://resend.com)
2. Verify your domain
3. Get API key
4. Add to `.env.local`

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
npx prisma generate
```

### Database connection errors
- Check `SUPABASE_DB_URL` in `.env.local`
- Verify database is accessible
- Run `npx prisma db push`

### Authentication not working
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### Build errors
```bash
rm -rf .next
npm run build
```

## 📊 Monitoring Your Application

### Check Logs

```bash
# Development
npm run dev
# Watch console for errors

# Production (Vercel)
vercel logs
```

### Database Queries

```bash
# Open Prisma Studio
npx prisma studio

# View tables, edit data, run queries
```

### API Testing

```bash
# Test API endpoint
curl http://localhost:3000/api/user

# With authentication
curl -H "Cookie: next-auth.session-token=..." \
  http://localhost:3000/api/workflows
```

## 🚀 Deployment

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to:
# 1. Link to your Vercel account
# 2. Set project name
# 3. Configure environment variables
# 4. Deploy!
```

### Manual Setup

1. **Push to GitHub**
```bash
git add .
git commit -m "Next.js migration complete"
git push origin main
```

2. **Import to Vercel**
   - Go to vercel.com
   - Import your repository
   - Add environment variables
   - Deploy

3. **Configure Domain**
   - Add custom domain in Vercel
   - Update DNS records
   - Update `NEXTAUTH_URL` in environment

See `DEPLOYMENT_GUIDE_NEXTJS.md` for detailed instructions.

## 📚 Learn More

### Documentation
- **README-NEXTJS.md** - Comprehensive overview
- **DEPLOYMENT_GUIDE_NEXTJS.md** - Production deployment
- **MIGRATION_GUIDE.md** - Migrating from Vite
- **COMPLETE_IMPLEMENTATION_SUMMARY.md** - Feature list

### Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Stripe Docs](https://stripe.com/docs)

## 🎨 Customization

### Update Branding

**Logo & Colors** (`tailwind.config.ts`):
```typescript
theme: {
  extend: {
    colors: {
      primary: '#1e40af',    // Your brand color
      secondary: '#06b6d4',  // Accent color
    }
  }
}
```

**Site Name** (`.env.local`):
```env
NEXT_PUBLIC_APP_NAME=YourBrandName
```

### Add More Features

All features are modular. To add new pages:

1. Create page in `app/(dashboard)/dashboard/your-feature/page.tsx`
2. Add route to sidebar in `app/(dashboard)/layout.tsx`
3. Create API route in `app/api/your-feature/route.ts`
4. Add Prisma model if needed in `prisma/schema.prisma`

## ✅ Quick Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] Stripe products created
- [ ] Email service configured
- [ ] Google OAuth configured
- [ ] Custom domain added
- [ ] SSL certificate active
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured
- [ ] Backup strategy in place

## 🆘 Need Help?

### Common Issues

**Q: Prisma errors?**
```bash
npx prisma generate
npx prisma db push
```

**Q: Next.js build fails?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Q: Authentication not working?**
- Check `NEXTAUTH_SECRET` is set
- Verify OAuth credentials
- Clear cookies and retry

**Q: Styles not loading?**
- Verify Tailwind config
- Check `globals.css` imported
- Restart dev server

### Getting Support

- 📧 Email: support@cortexcloud.online
- 📖 Docs: All documentation files in project
- 🐛 Issues: Check console for errors

## 🎉 You're Ready!

Your CortexCloud Next.js application is ready to use. Start by:

1. Running `npm run dev`
2. Creating your first user account
3. Exploring the dashboard features
4. Creating your first workflow
5. Uploading a document

**Happy automating!** 🚀

---

Built with Next.js 14+, Prisma, Stripe, and OpenAI


