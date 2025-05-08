const { connectToRabbitMQ, NOTIFICATION_QUEUE } = require('../config/rabbitmq');

// Publish a notification to RabbitMQ
const publishNotification = async (req, res) => {
  try {
    const { receiverId, senderId, type, content } = req.body;
    
    // Validate required fields
    if (!receiverId || !senderId || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Connect to RabbitMQ and get channel
    const { channel } = await connectToRabbitMQ();
    
    // Create notification payload
    const notification = {
      receiverId,
      senderId,
      type,
      content,
      timestamp: new Date().toISOString()
    };
    
    // Publish message to the queue
    channel.sendToQueue(
      NOTIFICATION_QUEUE,
      Buffer.from(JSON.stringify(notification)),
      { persistent: true } // Message survives broker restarts
    );
    
    console.log(`Notification published for user ${receiverId}`);
    
    res.status(201).json({ 
      message: 'Notification published successfully',
      notification 
    });
  } catch (error) {
    console.error('Error publishing notification:', error.message);
    res.status(500).json({ error: 'Failed to publish notification' });
  }
};

module.exports = {
  publishNotification
}; 