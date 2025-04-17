/**
 * Retry Utility Module
 * 
 * Purpose:
 * This module provides retry functionality for operations that might fail temporarily
 * but can succeed on subsequent attempts, improving system resilience.
 * 
 * Usage:
 * - Used in proxy.js to add retry capability to service calls
 * - Wraps functions with retry logic based on configurable options
 * - Automatically determines which errors are retryable
 * 
 * Key responsibilities:
 * - Determine which errors should trigger a retry
 * - Implement exponential backoff for retries
 * - Limit the maximum number of retry attempts
 * - Log retry attempts for observability
 * 
 * Role in the system:
 * - Improves reliability of communication with microservices
 * - Handles transient network errors automatically
 * - Works with the circuit breaker to provide robust error handling
 * - Prevents unnecessary failures due to temporary issues
 */
const promiseRetry = require('promise-retry');
const { logger } = require('../config/logger');

// Default retry options
const defaultRetryOptions = {
  retries: 3,
  factor: 2,
  minTimeout: 100,
  maxTimeout: 2000
};

/**
 * Determines if an error is retryable
 * @param {Error} err - The error to check
 * @returns {boolean} Whether the error is retryable
 */
function shouldRetry(err) {
  return (
    err.code === 'ECONNRESET' || 
    err.code === 'ETIMEDOUT' || 
    (err.statusCode && err.statusCode >= 500)
  );
}

/**
 * Wraps a function with retry logic
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Function} Function wrapped with retry logic
 */
function withRetry(fn, options = {}) {
  const retryOptions = { ...defaultRetryOptions, ...options };
  
  return (...args) => {
    return promiseRetry((retry, number) => {
      return fn(...args).catch(err => {
        if (shouldRetry(err)) {
          logger.info(`Retry #${number}`);
          return retry(err);
        }
        throw err;
      });
    }, retryOptions);
  };
}

module.exports = {
  shouldRetry,
  withRetry,
  defaultRetryOptions
}; 