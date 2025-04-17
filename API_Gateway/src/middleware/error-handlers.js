/**
 * Error Handling Middleware Module
 * 
 * Purpose:
 * This module provides centralized error handling for the API Gateway,
 * ensuring consistent error responses and proper logging of errors.
 * 
 * Usage:
 * - Used in app.js to register error handlers at the application level
 * - Handles validation errors, 404 errors, and unexpected exceptions
 * - Provides standardized error responses across the gateway
 * 
 * Key responsibilities:
 * - Register Celebrate/Joi validation error handler
 * - Handle 404 not found errors with a consistent response
 * - Catch and process all unhandled errors with proper logging
 * - Maintain a consistent error response format
 * 
 * Role in the system:
 * - Ensures API consumers receive consistent error responses
 * - Prevents uncaught errors from crashing the application
 * - Provides proper logging for debugging and monitoring
 */
const { errors } = require('celebrate');
const { logger } = require('../config/logger');

/**
 * Not found middleware
 * Handles requests to non-existent routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({ 
    code: 404, 
    status: 'Error', 
    message: 'Route not found', 
    data: null 
  });
}

/**
 * General error handler
 * Catches all unhandled errors
 */
function errorHandler(err, req, res, next) {
  logger.error({ err }, 'Unhandled error');
  
  res.status(500).json({ 
    code: 500, 
    status: 'Error', 
    message: 'Internal Server Error', 
    data: null 
  });
}

/**
 * Register all error handlers
 * @param {Express} app - Express application
 */
function registerErrorHandlers(app) {
  // Validation errors from celebrate
  app.use(errors());
  
  // Not found handler
  app.use(notFoundHandler);
  
  // Generic error handler - must be last
  app.use(errorHandler);
}

module.exports = {
  registerErrorHandlers
}; 