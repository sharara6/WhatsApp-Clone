/**
 * Server Initialization Module
 * 
 * Purpose:
 * This module is responsible for initializing and running the API Gateway server,
 * including cluster management, process lifecycle, and error handling.
 * 
 * Usage:
 * - Imported by the main index.js entry point
 * - Handles clustering in production mode for better performance and reliability
 * - Manages process lifecycle events for graceful startup and shutdown
 * 
 * Key responsibilities:
 * - Production clustering - spawns multiple worker processes based on CPU cores
 * - Initializes Express app and HTTP server using app.js
 * - Sets up WebSocket server
 * - Handles process signals for graceful shutdown
 * - Global error handling for uncaught exceptions and unhandled rejections
 * 
 * Role in the system:
 * - Highest-level application orchestration
 * - Entry point for the system after index.js
 * - Manages process lifecycle and clustering
 */
const cluster = require('cluster');
const os = require('os');
const createApp = require('./app');
const { logger } = require('./config/logger');
const { connectRedis } = require('./config/redis');
const { initializeWebSocketServer } = require('./websocket/ws-server');
const env = require('./config/env');

/**
 * Start the server
 */
async function startServer() {
  try {
    // Connect to Redis
    await connectRedis();
    
    // Create Express app and HTTP server
    const { app, server } = createApp();
    
    // Initialize WebSocket server
    initializeWebSocketServer(server);
    
    // Start server
    const port = env.PORT;
    server.listen(port, () => {
      logger.info(`Worker ${process.pid} listening on port ${port}`);
    });
    
    // Handle termination signals
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach(signal => {
      process.on(signal, () => {
        logger.info(`${signal} received, shutting down gracefully`);
        
        server.close(() => {
          logger.info('HTTP server closed');
          process.exit(0);
        });
        
        // Force shutdown after 10s if graceful shutdown fails
        setTimeout(() => {
          logger.error('Forced shutdown due to timeout');
          process.exit(1);
        }, 10000);
      });
    });
    
    // Handle uncaught exceptions and rejections
    process.on('uncaughtException', (err) => {
      logger.fatal({ err }, 'Uncaught exception');
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason) => {
      logger.fatal({ reason }, 'Unhandled rejection');
    });
  } catch (err) {
    logger.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

// Run in cluster mode in production
if (cluster.isMaster && env.NODE_ENV === 'production') {
  const numCPUs = os.cpus().length;
  logger.info(`Master ${process.pid} is running, forking ${numCPUs} workers`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died, forking a new worker`);
    cluster.fork();
  });
} else {
  // Start server (either in single process mode or as a worker)
  startServer();
} 