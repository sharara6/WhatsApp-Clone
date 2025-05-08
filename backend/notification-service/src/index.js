const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToRabbitMQ, NOTIFICATION_QUEUE } = require('./config/rabbitmq');
const notificationRoutes = require('./routes/notification.routes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notifications', notificationRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Map to store user socket connections
const userSockets = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Handle client registering their user ID
  socket.on('register', (userId) => {
    console.log(`User ${userId} registered`);
    userSockets.set(userId, socket.id);
    
    // Add user to their own room for direct messaging
    socket.join(userId);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Remove user from map
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'notification-service' });
});

// Start RabbitMQ consumer
async function startConsumer() {
  try {
    const { channel } = await connectToRabbitMQ();
    
    // Consume messages from the notification queue
    channel.consume(
      NOTIFICATION_QUEUE, 
      (msg) => {
        if (msg) {
          try {
            // Parse the notification message
            const notification = JSON.parse(msg.content.toString());
            console.log('Received notification:', notification);
            
            const { receiverId, senderId, type, content } = notification;
            
            // Emit notification to specific user via their room
            if (receiverId) {
              io.to(receiverId).emit('notification', {
                type,
                senderId,
                content,
                timestamp: new Date().toISOString()
              });
              
              console.log(`Notification sent to user ${receiverId}`);
            }
            
            // Acknowledge the message
            channel.ack(msg);
          } catch (error) {
            console.error('Error processing notification:', error.message);
            // Acknowledge the message even in case of error to avoid blocking the queue
            channel.ack(msg);
          }
        }
      },
      {
        noAck: false // Manual acknowledgment
      }
    );
    
    console.log('Notification consumer started');
  } catch (error) {
    console.error('Failed to start consumer:', error.message);
    // Retry after 5 seconds
    setTimeout(startConsumer, 5000);
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
  // Start consuming messages from RabbitMQ
  startConsumer();
}); 