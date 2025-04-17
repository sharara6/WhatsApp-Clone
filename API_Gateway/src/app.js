/**
 * Express Application Configuration Module
 * 
 * Purpose:
 * This module configures and initializes the Express application with all necessary
 * middleware, security settings, and routes. It creates a ready-to-use Express app
 * with HTTP server but doesn't start listening (that's handled by server.js).
 * 
 * Usage:
 * - Imported by server.js which calls createApp() to get the configured app
 * - Sets up all middleware in the correct order
 * - Registers routes and error handlers
 * 
 * Key responsibilities:
 * - Configure Express application middleware stack
 * - Set up security features (CORS, Helmet, rate limiting)
 * - Register route handlers
 * - Configure error handling
 * 
 * Role in the system:
 * - Central configuration point for the Express application
 * - Returns both the app and HTTP server instances for use in server.js
 * - Delegates to specialized modules for specific functionality
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const env = require('./config/env');
const { expressLogger } = require('./config/logger');
const { rateLimitMiddleware, timeoutMiddleware } = require('./middleware/rate-limit');
const { registerErrorHandlers } = require('./middleware/error-handlers');
const healthRoutes = require('./routes/health');
const { registerProxyRoutes } = require('./routes/proxy');

/**
 * Configure Express application
 * @returns {Object} app and server instances
 */
function createApp() {
  // Create Express app
  const app = express();
  const server = createServer(app);
  
  // Restricted CORS setup
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',');
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
  
  // Apply security and utility middleware
  app.use(helmet());
  app.use(expressLogger);
  app.use(express.json({ limit: '1mb' }));
  app.disable('x-powered-by');
  
  // Apply rate limiting and timeout middleware
  app.use(rateLimitMiddleware);
  app.use(timeoutMiddleware);
  
  // Register routes
  app.use(healthRoutes);
  registerProxyRoutes(app);
  
  // Register error handlers - must be last
  registerErrorHandlers(app);
  
  return { app, server };
}

module.exports = createApp; 