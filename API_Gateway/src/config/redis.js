/**
 * Redis Client Configuration Module
 * 
 * Purpose:
 * This module initializes and manages the Redis client for caching, rate limiting,
 * and other Redis-dependent features of the API Gateway.
 * 
 * Usage:
 * - Imported by modules that need Redis functionality
 * - Provides a centralized Redis client instance for the entire application
 * - Includes utility functions for connection management and health checks
 * 
 * Key responsibilities:
 * - Initialize Redis client with proper configuration
 * - Connect to Redis and handle connection errors
 * - Provide health check functionality
 * - Expose the client instance for use in other modules
 * 
 * Role in the system:
 * - Required for rate limiting, caching, and other distributed features
 * - Critical dependency for the gateway's performance optimization features
 * - Used for health checks to ensure the system is working properly
 */
const redis = require('redis');
const env = require('./env');
const { logger } = require('./logger');

// Initialize Redis client
const redisClient = redis.createClient({ url: env.REDIS_URL });

// Connect to Redis
async function connectRedis() {
  try {
    await redisClient.connect();
    logger.info('Connected to Redis');
  } catch (err) {
    logger.error({ err }, 'Failed to connect to Redis');
    process.exit(1);
  }
}

// Ping Redis to check connection
async function pingRedis() {
  try {
    await redisClient.ping();
    return true;
  } catch (err) {
    logger.error({ err }, 'Redis ping failed');
    return false;
  }
}

module.exports = {
  redisClient,
  connectRedis,
  pingRedis
}; 