const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

// RabbitMQ connection URL from environment variables or default
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

// Queue names
const NOTIFICATION_QUEUE = 'notification_queue';

// Connect to RabbitMQ
async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log('Connected to RabbitMQ');
    
    const channel = await connection.createChannel();
    console.log('Channel created');
    
    // Ensure queue exists
    await channel.assertQueue(NOTIFICATION_QUEUE, {
      durable: true // Queue survives broker restarts
    });
    console.log(`Queue ${NOTIFICATION_QUEUE} asserted`);
    
    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error.message);
    throw error;
  }
}

// Function to close RabbitMQ connection
async function closeConnection(connection) {
  try {
    await connection.close();
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error.message);
  }
}

module.exports = {
  connectToRabbitMQ,
  closeConnection,
  NOTIFICATION_QUEUE
}; 