const redis = require('./redis.js');
const WINDOW_SIZE = 60000; // 1 minute
const MAX_REQUESTS = 120; // Increased to 120 requests per minute
const MIN_INTERVAL = 100; // Reduced to 100ms between requests

// List of paths that should be excluded from rate limiting
const EXCLUDED_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/check',
  '/api/messages',  // Exclude all message endpoints
  '/socket.io',     // Exclude socket.io connections
  '/health',
  '/debug'
];

const slidingWindowRateLimiter = async (req, res, next) => {
  // Skip rate limiting for excluded paths
  if (EXCLUDED_PATHS.some(path => req.path.startsWith(path))) {
    return next();
  }

  // Skip rate limiting for WebSocket upgrade requests
  if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
    return next();
  }

  const userKey = req.user?.username || req.ip; // Fallback to IP if no user
  const key = `rate_limiter:${userKey}`;
  const now = Date.now();
  const windowStart = now - WINDOW_SIZE;

  try {
    // Remove timestamps older than the window
    await redis.zremrangebyscore(key, 0, windowStart);

    // Count current requests in window
    const recentRequests = await redis.zrange(key, 0, -1, 'WITHSCORES');
    const requestCount = recentRequests.length / 2;

    if (requestCount >= MAX_REQUESTS) {
      return res.status(429).json({ 
        error: 'Too many requests. Rate limit reached',
        retryAfter: Math.ceil((windowStart + WINDOW_SIZE - now) / 1000)
      });
    }

    const lastRequestTime = parseInt(recentRequests[recentRequests.length - 1]);
    if (lastRequestTime && now - lastRequestTime < MIN_INTERVAL) {
      const wait = MIN_INTERVAL - (now - lastRequestTime);
      return res.status(429).json({
        error: 'Too many requests, please slow down.',
        retryIn: `${wait}ms`,
      });
    }

    // Add current request with timestamp
    await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.pexpire(key, WINDOW_SIZE);

    next();
  } catch (err) {
    console.error('[SlidingWindowLimiter] Redis error:', err);
    // On Redis error, allow the request to proceed
    next();
  }
};

const setupRateLimit = (app, routes) => {
  // Apply rate limiting to all routes
  app.use(slidingWindowRateLimiter);
};

module.exports = { setupRateLimit };