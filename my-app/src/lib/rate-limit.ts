import { AppError } from "@/lib/errors";

interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new Map<string, number[]>();

  return {
    check: async (limit: number, token: string): Promise<void> => {
      const now = Date.now();
      const tokenTimestamps = tokenCache.get(token) || [];
      
      const validTimestamps = tokenTimestamps.filter((timestamp) => now - timestamp < options.interval);
      
      if (validTimestamps.length >= limit) {
        throw new AppError("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
      }
      
      validTimestamps.push(now);
      tokenCache.set(token, validTimestamps);
      
      if (tokenCache.size > options.uniqueTokenPerInterval) {
        const oldestKey = tokenCache.keys().next().value;
        if (oldestKey !== undefined) {
          tokenCache.delete(oldestKey);
        }
      }
    }
  };
}

export const apiLimiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 1000,
});

export const authLimiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 1000,
});
