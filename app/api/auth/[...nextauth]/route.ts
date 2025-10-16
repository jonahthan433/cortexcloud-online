import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Ensure this route runs on the Node.js runtime (not Edge) and is always dynamic
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// NextAuth v5 returns an object with handlers; export them directly
export const { handlers: { GET, POST } } = NextAuth(authOptions);


