# CortexCloud - AI-Powered Business Automation Platform

A comprehensive Next.js 14+ SaaS application with AI-powered workflow automation, document processing, and business intelligence.

## 🚀 Features

### Core Functionality
- **Visual Workflow Builder**: Drag-and-drop automation creation
- **AI Document Processing**: Extract and analyze data using OpenAI
- **Smart Integrations**: Connect with 100+ services
- **Real-time Analytics**: Track performance and metrics
- **Team Collaboration**: Role-based access control
- **Enterprise Security**: SOC 2, GDPR compliant

### Technical Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Database**: Supabase PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (Google, GitHub, Credentials)
- **Payments**: Stripe subscriptions
- **AI**: OpenAI GPT-4
- **Email**: Resend
- **State**: Zustand
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18.17+ 
- npm 9.0+
- Supabase account
- Stripe account (test mode)
- OpenAI API key
- Resend API key (or SendGrid)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### 2. Environment Setup

Copy `env.nextjs.example` to `.env.local` and fill in your values:

```bash
cp env.nextjs.example .env.local
```

**Required Environment Variables:**

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CortexCloud

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DB_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_BUSINESS=price_...

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@cortexcloud.online
```

### 3. Database Setup

```bash
# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev

# Open Prisma Studio to view data
npx prisma studio
```

### 4. Stripe Setup

1. Create products in Stripe Dashboard:
   - Professional ($49/month)
   - Business ($149/month)
2. Copy price IDs to `.env.local`
3. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhooks`
4. Add webhook events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
cortexcloud/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── (marketing)/         # Public marketing pages
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── workflows/      # Workflow CRUD
│   │   ├── documents/      # Document processing
│   │   ├── stripe/         # Stripe integration
│   │   └── billing/        # Billing endpoints
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/              # React components
│   ├── layout/             # Layout components
│   ├── ui/                 # Shadcn/ui components
│   └── ...                 # Feature components
├── lib/                     # Utilities and configs
│   ├── prisma.ts           # Prisma client
│   ├── stripe.ts           # Stripe client
│   ├── openai.ts           # OpenAI client
│   ├── email.ts            # Email service
│   ├── auth.ts             # NextAuth config
│   ├── rate-limit.ts       # Rate limiting
│   ├── rbac.ts             # Access control
│   ├── utils.ts            # Utility functions
│   └── stores/             # Zustand stores
├── prisma/                  # Database schema
│   └── schema.prisma       # Prisma schema
├── middleware.ts            # Next.js middleware
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎯 Key Features Implementation

### Authentication
- NextAuth.js with multiple providers
- Session management
- Protected routes via middleware
- Role-based access control

### Workflows
- CRUD operations
- Visual builder (placeholder for React Flow)
- Status management (Draft, Active, Paused)
- Execution tracking

### Documents
- File upload with validation
- AI processing with OpenAI
- Status tracking
- Data extraction

### Billing
- Stripe subscription integration
- Usage tracking
- Plan limits enforcement
- Customer portal

### Analytics
- Usage metrics
- Success rates
- Performance tracking
- Export capabilities

## 🔒 Security Features

- Rate limiting (Upstash Redis)
- Input sanitization (Zod schemas)
- CSRF protection
- XSS prevention
- SQL injection protection (Prisma)
- Audit logging
- API key encryption

## 📊 Database Models

Key Prisma models:
- `User`: User accounts and profiles
- `Workspace`: Team workspaces
- `Workflow`: Automation workflows
- `Document`: Processed documents
- `Subscription`: Stripe subscriptions
- `Usage`: Usage tracking
- `AuditLog`: Security audit trail

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables in Production

Ensure all environment variables are set in your hosting platform:
- Update `NEXTAUTH_URL` to your production domain
- Update `NEXT_PUBLIC_APP_URL`
- Use production API keys (Stripe, OpenAI, etc.)
- Set strong `NEXTAUTH_SECRET`

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Type checking
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema to DB
npm run prisma:studio    # Open Prisma Studio
npm run test         # Run tests
npm run test:e2e     # Run E2E tests
```

## 🎨 Customization

### Brand Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  primary: '#1e40af',  // Deep blue
  secondary: '#06b6d4', // Cyan
  accent: '#8b5cf6',    // Purple
}
```

### Email Templates
Located in `lib/email.ts`. Customize HTML templates for:
- Welcome emails
- Password reset
- Workflow notifications
- Invoice emails

### Subscription Plans
Edit `lib/stripe.ts` and `lib/rbac.ts` to adjust:
- Plan prices
- Feature limits
- Access controls

## 🐛 Troubleshooting

### Prisma Issues
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables
- Ensure all required variables are set
- Check for typos in variable names
- Restart dev server after changes

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Stripe Documentation](https://stripe.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

- Email: support@cortexcloud.online
- Documentation: https://cortexcloud.online/docs
- Discord: [Join our community](#)

---

Built with ❤️ by the CortexCloud team


