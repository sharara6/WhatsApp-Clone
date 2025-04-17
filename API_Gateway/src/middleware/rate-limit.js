/**
 * Rate Limiting and Timeout Middleware Module
 * 
 * Purpose:
 * This module protects the API Gateway from abuse and overloading by
 * implementing rate limiting based on client IP and timeout controls.
 * 
 * Usage:
 * - Applied at the application level in app.js
 * - Limits requests per IP address using Redis
 * - Sets a timeout for all requests to prevent hanging connections
 * 
 * Key responsibilities:
 * - Track request counts per IP address in Redis
 * - Enforce rate limits based on configuration
 * - Set request timeouts to prevent long-running requests
 * - Return appropriate error responses when limits are exceeded
 * 
 * Role in the system:
 * - Protects backend services from abuse
 * - Prevents denial of service attacks
 * - Ensures fair resource allocation among clients
 * - Improves system stability under load
 */
const { redisClient } = require('../config/redis');
const { logger } = require('../config/logger');
const env = require('../config/env');

/**
 * Rate limiting middleware
 * Limits request by IP address using Redis
 */
async function rateLimitMiddleware(req, res, next) {
  const ip = req.ip;
  const key = `ratelimit:${ip}`;
  
  try {
    const current = await redisClient.incr(key);
    
    // Set expiry on first request
    if (current === 1) {
      await redisClient.expire(key, env.RATE_LIMIT_WINDOW);
    }
    
    // Check if rate limit exceeded
    if (current > env.RATE_LIMIT) {
      return res.status(429).json({ 
        code: 429, 
        status: 'Error', 
        message: 'Rate limit exceeded', 
        data: null 
      });
    }
  } catch (err) {
    logger.error({ err }, 'Rate limiter error');
  }
  
  next();
}

/**
 * Request timeout middleware
 * Sets a timeout for requests to prevent hanging connections
 */
function timeoutMiddleware(req, res, next) {
  req.setTimeout(15000, () => {
    res.status(504).json({ 
      code: 504, 
      status: 'Error', 
      message: 'Gateway timeout', 
      data: null 
    });
    req.abort();
  });
  
  next();
}

module.exports = {
  rateLimitMiddleware,
  timeoutMiddleware
}; 