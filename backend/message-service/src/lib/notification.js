import axios from 'axios';

// Get notification service URL from environment variable or use default
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5003';

/**
 * Send a notification when a new message is received
 * @param {string} receiverId - ID of the user receiving the notification
 * @param {string} senderId - ID of the user who sent the message
 * @param {string} content - Content of the notification
 * @returns {Promise} - The axios response
 */
export const sendMessageNotification = async (receiverId, senderId, content) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/publish`, {
      receiverId,
      senderId,
      type: 'message',
      content: content || 'You received a new message'
    });
    
    console.log('Notification sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send notification:', error.message);
    // Don't throw error, just log it - notification failure shouldn't break message flow
    return null;
  }
}; 