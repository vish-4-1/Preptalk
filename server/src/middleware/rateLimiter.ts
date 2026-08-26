import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export function createRateLimiter(options: { windowMs: number; maxRequests: number; message?: string }) {
  const store: RateLimitStore = {};
  const { windowMs, maxRequests, message = 'Too many requests, please try again later.' } = options;

  // Periodic cleanup of stale IP records every 10 minutes
  setInterval(() => {
    const now = Date.now();
    for (const ip in store) {
      if (store[ip].resetTime < now) {
        delete store[ip];
      }
    }
  }, 10 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    store[ip].count += 1;

    if (store[ip].count > maxRequests) {
      const retryAfterSec = Math.ceil((store[ip].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: message,
        retryAfter: `${retryAfterSec} seconds`,
      });
    }

    next();
  };
}
