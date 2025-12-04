import { handlers } from '@/lib/auth';

// Ensure this route runs on the Node.js runtime (not Edge) and is always dynamic
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Export handlers from lib/auth
export const { GET, POST } = handlers;


