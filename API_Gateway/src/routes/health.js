/**
 * Health Check Routes Module
 * 
 * Purpose:
 * This module provides health check endpoints for monitoring the API Gateway
 * and its dependencies (primarily Redis).
 * 
 * Usage:
 * - Registered in app.js to expose the /health endpoint
 * - Used by monitoring systems to check service health
 * - Verifies Redis connectivity as part of health check
 * 
 * Key responsibilities:
 * - Expose a /health endpoint that returns service status
 * - Check Redis connection status
 * - Return appropriate status codes based on system health
 * - Include uptime and version information in the response
 * 
 * Role in the system:
 * - Critical for monitoring and alerting
 * - Used by load balancers to determine if the service is available
 * - Helps with troubleshooting and observability
 */
const express = require('express');
const { pingRedis } = require('../config/redis');
const { logger } = require('../config/logger');

const router = express.Router();

/**
 * Health check endpoint
 * Verifies connection to Redis and returns service status
 */
router.get('/health', async (req, res) => {
  try {
    // Check Redis connection
    const redisStatus = await pingRedis();
    
    if (!redisStatus) {
      return res.status(500).json({
        status: 'error',
        message: 'Redis connection failed',
        timestamp: new Date().toISOString()
      });
    }
    
    // All checks passed
    res.json({
      status: 'ok',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    logger.error({ err }, 'Health check failed');
    res.status(500).json({
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 