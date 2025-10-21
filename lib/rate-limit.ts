import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter that allows 10 requests per 10 seconds
let ratelimit: Ratelimit | null = null;

// Check if Redis is properly configured (not placeholder values)
const hasValidRedis = 
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_TOKEN &&
  !process.env.UPSTASH_REDIS_REST_URL.includes('your_') &&
  !process.env.UPSTASH_REDIS_REST_TOKEN.includes('your_') &&
  process.env.UPSTASH_REDIS_REST_URL.startsWith('https://');

if (hasValidRedis) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: '@upstash/ratelimit',
  });
}

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}> {
  if (!ratelimit) {
    // If rate limiting is not configured, allow all requests
    return { success: true };
  }

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

  return { success, limit, remaining, reset };
}

// Different rate limits for different operations
export async function checkAPIRateLimit(identifier: string) {
  // More restrictive for API calls
  if (!ratelimit) {
    return { success: true };
  }

  const apiLimiter = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    }),
    limiter: Ratelimit.slidingWindow(100, '1 h'),
    analytics: true,
  });

  return await apiLimiter.limit(identifier);
}

export async function checkAuthRateLimit(identifier: string) {
  // Very restrictive for auth attempts
  if (!ratelimit) {
    return { success: true };
  }

  const authLimiter = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    }),
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
  });

  return await authLimiter.limit(identifier);
}


