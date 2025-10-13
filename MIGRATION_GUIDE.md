# Migration Guide: React/Vite to Next.js 14+

Guide for migrating from the existing React/Vite CortexCloud app to the new Next.js 14+ implementation.

## 🎯 Overview

This migration involves:
- Moving from client-side React to Next.js App Router
- Replacing React Router with Next.js routing
- Converting Supabase direct client to Prisma ORM
- Migrating contexts to NextAuth + Zustand
- Updating all components for server/client architecture

## 📋 Pre-Migration Steps

### 1. Backup Current System
```bash
# Backup database
pg_dump $SUPABASE_DB_URL > backup-pre-migration.sql

# Backup code
git checkout -b backup-vite-version
git push origin backup-vite-version
```

### 2. Document Current Features
- [ ] List all routes
- [ ] Document API endpoints
- [ ] Note custom features
- [ ] Record environment variables
- [ ] Screenshot current UI

### 3. Set Up New Project

```bash
# Create new directory (or use existing)
mkdir cortexcloud-nextjs
cd cortexcloud-nextjs

# Copy new Next.js files
# (Use the files created in this migration)

# Install dependencies
npm install
```

## 🔄 Component Migration

### Component Conversion Strategy

#### 1. Identify Component Type

**Client Components** (need `"use client"`):
- Use hooks (useState, useEffect, etc.)
- Event handlers
- Browser APIs
- Context consumers

**Server Components** (default):
- Data fetching
- Database queries
- No interactivity

#### 2. Convert Components

Example migration:

**Before (React/Vite):**
```typescript
// src/components/WorkflowCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function WorkflowCard({ workflow }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div onClick={() => navigate(`/workflow/${workflow.id}`)}>
      {/* component */}
    </div>
  );
}
```

**After (Next.js):**
```typescript
// components/WorkflowCard.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function WorkflowCard({ workflow }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Link href={`/dashboard/workflows/${workflow.id}`}>
      {/* component */}
    </Link>
  );
}
```

### Key Changes:
1. Add `'use client'` if component uses hooks/events
2. Replace `react-router-dom` with `next/navigation` and `next/link`
3. Update routing paths
4. Move to `components/` directory (not `src/components/`)

## 🗄️ Database Migration

### From Supabase Client to Prisma

**Before:**
```typescript
// src/services/workflowService.ts
import { supabase } from '@/integrations/supabase/client';

export async function getWorkflows() {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('user_id', userId);
    
  return data;
}
```

**After:**
```typescript
// app/api/workflows/route.ts
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const workflows = await prisma.workflow.findMany({
    where: { user_id: userId },
  });
  
  return NextResponse.json({ workflows });
}
```

### Migration Steps:

1. **Keep Supabase for Auth** (or migrate to NextAuth)
2. **Use Prisma for data access**
3. **Migrate schema**:

```bash
# Introspect existing database
npx prisma db pull

# Generate Prisma Client
npx prisma generate

# Review and enhance schema.prisma
# Then push changes
npx prisma db push
```

## 🔐 Authentication Migration

### From Custom AuthContext to NextAuth

**Before:**
```typescript
// src/contexts/AuthContext.tsx
const { user, signIn, signOut } = useAuth();
```

**After:**
```typescript
// Using NextAuth
import { useSession, signIn, signOut } from 'next-auth/react';

const { data: session } = useSession();
const user = session?.user;
```

### Migration Steps:

1. Install NextAuth: `npm install next-auth`
2. Configure providers in `lib/auth.ts`
3. Create API route: `app/api/auth/[...nextauth]/route.ts`
4. Update all auth references
5. Test login/logout flows

## 🛣️ Routing Migration

### Route Mapping

| Old (React Router) | New (Next.js) | Type |
|-------------------|---------------|------|
| `/` | `app/(marketing)/page.tsx` | Public |
| `/login` | `app/(auth)/login/page.tsx` | Public |
| `/signup` | `app/(auth)/signup/page.tsx` | Public |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Protected |
| `/dashboard/workflows` | `app/(dashboard)/dashboard/workflows/page.tsx` | Protected |
| `/dashboard/workflows/:id` | `app/(dashboard)/dashboard/workflows/[id]/page.tsx` | Protected |

### Navigation Updates

**Before:**
```typescript
import { Link, useNavigate } from 'react-router-dom';

<Link to="/dashboard">Dashboard</Link>

const navigate = useNavigate();
navigate('/dashboard');
```

**After:**
```typescript
import Link from 'next/link';
import { useRouter } from 'next/navigation';

<Link href="/dashboard">Dashboard</Link>

const router = useRouter();
router.push('/dashboard');
```

## 📦 State Management Migration

### From React Context to Zustand

**Before:**
```typescript
// src/contexts/PlanContext.tsx
const [currentPlan, setCurrentPlan] = useState('free');

<PlanContext.Provider value={{ currentPlan, setCurrentPlan }}>
```

**After:**
```typescript
// lib/stores/billing-store.ts
import { create } from 'zustand';

export const useBillingStore = create((set) => ({
  currentPlan: 'free',
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
}));

// Usage
const { currentPlan, setCurrentPlan } = useBillingStore();
```

## 🎨 Styling Migration

### Existing Tailwind and Shadcn/ui work as-is!

1. Copy existing component styles
2. Verify Tailwind classes work
3. Update any custom CSS

## 📡 API Routes Migration

### From External API to Next.js API Routes

**Before:**
```typescript
// src/services/apiService.ts
export async function createWorkflow(data) {
  const response = await fetch('/api/workflows', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}
```

**After:**
```typescript
// app/api/workflows/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  const workflow = await prisma.workflow.create({
    data: body,
  });
  
  return NextResponse.json({ workflow });
}
```

## ✅ Testing Migration

### Test Each Feature

1. **Authentication**
   - [ ] Sign up
   - [ ] Login
   - [ ] Logout
   - [ ] Protected routes

2. **Workflows**
   - [ ] List workflows
   - [ ] Create workflow
   - [ ] Edit workflow
   - [ ] Delete workflow
   - [ ] Run workflow

3. **Documents**
   - [ ] Upload document
   - [ ] List documents
   - [ ] View document
   - [ ] Process with AI
   - [ ] Delete document

4. **Billing**
   - [ ] View plans
   - [ ] Upgrade plan
   - [ ] Checkout flow
   - [ ] Webhook processing
   - [ ] View usage

5. **UI/UX**
   - [ ] Responsive design
   - [ ] Dark mode
   - [ ] Loading states
   - [ ] Error handling

## 🚀 Deployment

1. **Test Locally**
```bash
npm run build
npm start
```

2. **Deploy to Staging**
- Use Vercel preview deployment
- Test all features
- Invite beta users

3. **Production Deployment**
- See DEPLOYMENT_GUIDE_NEXTJS.md
- Monitor for errors
- Have rollback plan ready

## 📊 Data Migration

If you have existing production data:

```sql
-- Verify data integrity
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM workflows;
SELECT COUNT(*) FROM documents;

-- Create indexes for performance
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);

-- Run migrations
npx prisma migrate deploy
```

## 🔍 Monitoring Post-Migration

### Week 1
- [ ] Check error rates
- [ ] Monitor performance
- [ ] Review user feedback
- [ ] Fix critical bugs

### Week 2-4
- [ ] Optimize slow queries
- [ ] Improve UI based on feedback
- [ ] Add missing features
- [ ] Update documentation

## ⚠️ Common Issues

### Issue: "Cannot use hooks in Server Component"
**Solution**: Add `'use client'` directive

### Issue: "Module not found"
**Solution**: Update import paths, use `@/` alias

### Issue: "Hydration error"
**Solution**: Ensure server and client render same HTML initially

### Issue: "Session not working"
**Solution**: Check NextAuth configuration and callbacks

## 📞 Support

Questions during migration?
- Check existing Next.js docs
- Review this migration guide
- Contact team lead

## ✨ Migration Complete!

Once all features are tested and working:
1. Update documentation
2. Train team on Next.js patterns
3. Archive old Vite version
4. Celebrate! 🎉

---

**Timeline Estimate:**
- Small app: 1-2 weeks
- Medium app: 2-4 weeks
- Large app: 4-8 weeks

Good luck with your migration!


