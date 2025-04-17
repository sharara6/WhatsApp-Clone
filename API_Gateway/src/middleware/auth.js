/**
 * Authentication Middleware Module
 * 
 * Purpose:
 * This module handles JWT authentication for all protected routes in the API Gateway.
 * It extracts, validates, and decodes JWT tokens from request headers.
 * 
 * Usage:
 * - Used in proxy.js to protect service routes
 * - Verifies the JWT token in the Authorization header
 * - Attaches the decoded user object to the request for downstream services
 * 
 * Key responsibilities:
 * - Extract JWT token from Authorization header
 * - Validate token using JWT_SECRET
 * - Attach decoded user information to request object
 * - Return appropriate error responses for authentication failures
 * 
 * Role in the system:
 * - Centralized authentication for all microservices
 * - Prevents unauthorized access to protected resources
 * - Simplifies microservice implementation by handling auth at the gateway level
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * JWT Authentication Middleware
 * Verifies JWT token in the Authorization header
 */
function verifyJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      code: 401, 
      status: 'Error', 
      message: 'Missing token',
      data: null 
    });
  }
  
  jwt.verify(token, env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        code: 403, 
        status: 'Error', 
        message: 'Invalid token',
        data: null 
      });
    }
    
    req.user = user;
    next();
  });
}

module.exports = {
  verifyJWT
}; 