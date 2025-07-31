// Rate Limiter using in-memory store (for production use Redis or similar)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.resetTime) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  async checkLimit(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const key = identifier;
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.store.set(key, newEntry);
      
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: newEntry.resetTime,
      };
    }

    if (entry.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    this.store.set(key, entry);

    return {
      allowed: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Global instance
const rateLimiter = new InMemoryRateLimiter();

export async function rateLimit(
  request: Request,
  options: {
    limit: number;
    windowMs: number;
    keyGenerator?: (req: Request) => string;
  }
) {
  const { limit, windowMs, keyGenerator } = options;
  
  // Default key generator uses IP address
  const defaultKeyGenerator = (req: Request) => {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip;
  };

  const identifier = keyGenerator ? keyGenerator(request) : defaultKeyGenerator(request);
  
  return await rateLimiter.checkLimit(identifier, limit, windowMs);
}

export { rateLimiter };