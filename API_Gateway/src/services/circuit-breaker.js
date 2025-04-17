/**
 * Circuit Breaker Service Module
 * 
 * Purpose:
 * This module implements the Circuit Breaker pattern to prevent cascading failures
 * when downstream services are failing or experiencing issues.
 * 
 * Usage:
 * - Used in proxy.js to wrap service calls with circuit breaking logic
 * - Automatically tracks failure rates and trips the circuit when thresholds are exceeded
 * - Provides fallback responses when the circuit is open
 * 
 * Key responsibilities:
 * - Create circuit breaker instances with appropriate configuration
 * - Track service call failures and success rates
 * - Open the circuit when failure threshold is exceeded
 * - Implement fallback behavior for when the circuit is open
 * - Automatically reset the circuit after a configured timeout
 * 
 * Role in the system:
 * - Prevents cascading failures across microservices
 * - Improves system resilience and stability
 * - Allows for graceful degradation when services are unavailable
 * - Protects backend services during partial outages
 */
const CircuitBreaker = require('opossum');
const { logger } = require('../config/logger');

// Default circuit breaker options
const defaultCircuitOptions = {
  timeout: 10000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};

/**
 * Creates a circuit breaker around a function
 * @param {Function} fn - Function to protect with circuit breaker
 * @param {Object} options - Circuit breaker options
 * @returns {CircuitBreaker} CircuitBreaker instance
 */
function createBreaker(fn, options = {}) {
  const circuitOptions = { ...defaultCircuitOptions, ...options };
  
  const breaker = new CircuitBreaker(fn, circuitOptions);
  
  // Log circuit state changes
  breaker.on('open', () => logger.warn('Circuit breaker opened'));
  breaker.on('halfOpen', () => logger.info('Circuit breaker half-open'));
  breaker.on('close', () => logger.info('Circuit breaker closed'));
  
  // Set default fallback
  breaker.fallback((req, res) => {
    return res.status(503).json({
      code: 503,
      status: 'Error',
      message: 'Service temporarily unavailable (fallback)',
      data: null
    });
  });
  
  return breaker;
}

module.exports = {
  createBreaker,
  defaultCircuitOptions
}; 