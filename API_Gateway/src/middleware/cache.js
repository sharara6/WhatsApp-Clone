/**
 * Caching Middleware Module
 * 
 * Purpose:
 * This module implements Redis-based caching for GET requests to improve
 * performance and reduce load on backend microservices.
 * 
 * Usage:
 * - Used in proxy.js for all proxied service routes
 * - Automatically caches GET responses for 60 seconds
 * - Returns cached responses when available instead of forwarding to microservices
 * 
 * Key responsibilities:
 * - Check if a cached response exists for the current request
 * - Return cached response if available
 * - Store responses in cache for future requests
 * - Only cache GET requests (not mutations)
 * 
 * Role in the system:
 * - Improves response times for frequently requested data
 * - Reduces load on backend microservices
 * - Provides a performance optimization layer
 */
const { redisClient } = require('../config/redis');
const { logger } = require('../config/logger');

/**
 * Cache middleware for GET requests
 * Caches responses for 60 seconds by default
 */
async function cacheMiddleware(req, res, next) {
  // Only cache GET requests
  if (req.method !== 'GET') return next();
  
  const key = `cache:${req.originalUrl}`;
  
  try {
    // Check if response is in cache
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // If not in cache, store the response
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await redisClient.setEx(key, 60, JSON.stringify(body));
      originalJson(body);
    };
  } catch (err) {
    logger.error({ err }, 'Cache error');
  }
  
  next();
}

module.exports = {
  cacheMiddleware
}; 