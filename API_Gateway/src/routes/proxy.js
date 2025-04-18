/**
 * Service Proxy Routes Module
 * 
 * Purpose:
 * This module manages routing and proxying of requests to backend microservices.
 * It applies authentication, validation, caching, retry logic, and circuit breaking
 * to ensure reliable and secure communication with microservices.
 * 
 * Usage:
 * - Registered in app.js to handle all microservice routes
 * - Defines validation schemas for request payloads
 * - Routes requests to appropriate backend services
 * 
 * Key responsibilities:
 * - Define validation schemas for each microservice endpoint
 * - Create protected proxy middleware with auth, validation, and reliability patterns
 * - Register routes for each microservice with proper prefixing
 * - Support legacy (non-versioned) routes with redirection
 * 
 * Role in the system:
 * - Core routing component of the API Gateway
 * - Implements the Backend for Frontend (BFF) pattern
 * - Centralizes cross-cutting concerns like auth and validation
 * - Provides reliability patterns for all service communication
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { celebrate, Segments } = require('celebrate');
const Joi = require('joi');
const { verifyJWT } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');
const { withRetry } = require('../utils/retry');
const { createBreaker } = require('../services/circuit-breaker');
const { logger } = require('../config/logger');
const env = require('../config/env');

// API Version prefix
const API_VERSION = '/v1';

// Define validation schemas for routes
const validationSchemas = {
  auth: {
    '/login': celebrate({
      [Segments.BODY]: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      })
    }),
    '/register': celebrate({
      [Segments.BODY]: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        name: Joi.string().required()
      })
    })
  },
  users: {
    '/:id': celebrate({
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required()
      })
    })
  },
  message: {
    '/send': celebrate({
      [Segments.BODY]: Joi.object({
        chatId: Joi.string().required(),
        content: Joi.string().required(),
        mediaUrl: Joi.string().uri().optional()
      })
    })
  },
  videoCompression: {
    '/compress': celebrate({
      [Segments.BODY]: Joi.object({
        inputPath: Joi.string().required(),
        outputPath: Joi.string().required()
      })
    })
  }
};

/**
 * Creates a protected proxy to a service
 * @param {String} route - The route path
 * @param {String} target - The target service URL
 * @param {Object} validations - The validation middleware for specific endpoints
 * @returns {Array} Middleware array for the route
 */
function createProtectedProxy(route, target, validations = {}) {
  // Setup proxy options
  const proxyOpts = {
    target,
    changeOrigin: true,
    ws: true,
    pathRewrite: { [`^${route}`]: '' },
    logLevel: 'warn',
    onError: (err, req, res) => {
      logger.error({ err, route }, 'Proxy error');
      res.status(500).json({
        code: 500,
        status: 'Error',
        message: 'Could not connect to service',
        data: null
      });
    }
  };

  // Create the proxy middleware
  const proxyMiddleware = createProxyMiddleware(proxyOpts);

  // Wrap proxy in a Promise
  function rawProxy(req, res) {
    return new Promise((resolve, reject) => {
      proxyMiddleware(req, res, err => err ? reject(err) : resolve());
    });
  }

  // Add retry logic
  const retryableProxy = withRetry((req, res) => rawProxy(req, res));

  // Add circuit breaker
  const circuitBreakerProxy = createBreaker((req, res) => retryableProxy(req, res));

  // Create router for this service
  const router = express.Router();

  // Apply validations for each endpoint
  Object.entries(validations).forEach(([path, validator]) => {
    router.use(path, validator);
  });

  // Apply auth, cache, and protected proxy
  router.use(verifyJWT, cacheMiddleware, (req, res, next) => {
    circuitBreakerProxy.fire(req, res)
      .catch(err => {
        logger.error({ err, route }, 'Protected proxy error');
        next(err);
      });
  });

  return router;
}

/**
 * Register service routes
 * @param {Express} app - Express application
 */
function registerProxyRoutes(app) {
  // Define microservices
  const services = [
    {
      route: `${API_VERSION}/auth`,
      target: env.AUTH_SERVICE_URL,
      validations: validationSchemas.auth
    },
    {
      route: `${API_VERSION}/users`,
      target: env.USERS_SERVICE_URL,
      validations: validationSchemas.users
    },
    {
      route: `${API_VERSION}/chats`,
      target: env.CHATS_SERVICE_URL,
      validations: {}
    },
    {
      route: `${API_VERSION}/message`,
      target: env.MESSAGE_SERVICE_URL,
      validations: validationSchemas.message
    },
    {
      route: `${API_VERSION}/media`,
      target: env.MEDIA_SERVICE_URL,
      validations: {}
    },
    {
      route: `${API_VERSION}/video-compression`,
      target: env.VIDEO_COMPRESSION_SERVICE_URL,
      validations: validationSchemas.videoCompression
    }
  ];

  // Register each service route
  services.forEach(({ route, target, validations }) => {
    const router = createProtectedProxy(route, target, validations);
    app.use(route, router);

    // Legacy route support with redirection
    const legacyRoute = route.replace(API_VERSION, '');
    app.use(legacyRoute, (req, res) => {
      logger.warn(`Deprecated API path accessed: ${req.originalUrl}`);
      res.redirect(308, req.originalUrl.replace(legacyRoute, route));
    });
  });
}

module.exports = {
  registerProxyRoutes
}; 