/**
 * WebSocket Server Module
 * 
 * Purpose:
 * This module sets up and manages WebSocket connections for real-time communication
 * between clients and the backend services through the API Gateway.
 * 
 * Usage:
 * - Initialized in server.js with the HTTP server instance
 * - Handles WebSocket connections with authentication
 * - Manages connection lifecycle (connect, message, disconnect)
 * 
 * Key responsibilities:
 * - Initialize WebSocket server attached to the HTTP server
 * - Authenticate WebSocket connections using JWT
 * - Handle incoming WebSocket messages
 * - Manage connection state and cleanup
 * - Implement heartbeat mechanism to detect dead connections
 * 
 * Role in the system:
 * - Provides real-time communication capabilities
 * - Validates authentication for WebSocket connections
 * - Handles connection lifecycle and state
 * - Ensures secure WebSocket communication
 */
const { WebSocketServer } = require('ws');
const { logger } = require('../config/logger');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Initialize WebSocket server
 * @param {http.Server} server - HTTP server instance
 * @returns {WebSocketServer} WebSocket server instance
 */
function initializeWebSocketServer(server) {
  const wss = new WebSocketServer({ server });
  
  // Handle new connections
  wss.on('connection', (ws, req) => {
    logger.info('WebSocket client connected');
    
    // Authenticate WebSocket connections
    try {
      const token = req.url.split('?token=')[1];
      
      if (!token) {
        logger.warn('WebSocket connection attempt without token');
        ws.close(1008, 'Authentication required');
        return;
      }
      
      // Verify JWT token
      jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
        if (err) {
          logger.warn({ err }, 'WebSocket auth failed');
          ws.close(1008, 'Authentication failed');
          return;
        }
        
        // Store user info on connection
        ws.user = decoded;
        
        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connection_established',
          message: 'Connected to WebSocket server'
        }));
      });
    } catch (err) {
      logger.error({ err }, 'WebSocket connection error');
      ws.close(1011, 'Server error');
    }
    
    // Handle messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        logger.debug({ message }, 'WebSocket message received');
        
        // Echo back for now
        ws.send(JSON.stringify({
          type: 'echo',
          message: message
        }));
      } catch (err) {
        logger.error({ err }, 'Error processing WebSocket message');
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      logger.info('WebSocket client disconnected');
    });
  });
  
  // Heartbeat interval to detect dead connections
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
  
  return wss;
}

module.exports = {
  initializeWebSocketServer
}; 