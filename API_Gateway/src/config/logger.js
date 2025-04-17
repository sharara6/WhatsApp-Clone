/**
 * Logging Configuration Module
 * 
 * Purpose:
 * This module configures and exports structured logging for the application.
 * It provides consistent logging throughout the system with appropriate levels 
 * based on the environment.
 * 
 * Usage:
 * - Imported by modules that need to log events or errors
 * - Provides both a raw logger and Express middleware logger
 * - Configures logging level based on the environment (development/production)
 * 
 * Key responsibilities:
 * - Configure Pino logger with appropriate settings
 * - Set up Express middleware for HTTP request logging
 * - Standardize log format with timestamps and levels
 * 
 * Role in the system:
 * - Centralized logging configuration
 * - Enables consistent, structured logging across all components
 * - Supports observability and debugging
 */
const pino = require('pino');
const expressPino = require('express-pino-logger');
const env = require('./env');

// Configure structured logging
const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Express middleware logger
const expressLogger = expressPino({ logger });

module.exports = {
  logger,
  expressLogger,
}; 