import { supabase } from '../lib/supabase.js';
import { Message } from "../models/message.model.js";
import minioClient from "../lib/minio.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import messageService from '../lib/messageService.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    
    // Get all users except the logged-in user
    const { data: users, error } = await supabase
      .from('users')
      .select('id, full_name, email, profile_pic')
      .neq('id', loggedInUserId);
    
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Error fetching users' });
    }

    // Get online users from socket
    const onlineUsers = req.app.get('onlineUsers') || new Set();
    
    const filteredUsers = users.map(user => ({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      profilePic: user.profile_pic ? `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/profile-pictures/${user.profile_pic.split('/').pop()}` : null,
      isOnline: onlineUsers.has(user.id)
    }));

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error in getUsersForSidebar:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'Sender and receiver IDs are required' });
    }
    
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ timestamp: 1 });
    
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content, type = 'text' } = req.body;
    
    if (!sender || !receiver || !content) {
      return res.status(400).json({ message: 'Sender, receiver, and content are required' });
    }
    
    const messageData = {
      sender,
      receiver,
      content,
      type,
      timestamp: new Date(),
      status: 'sent'
    };
    
    // Process with Socket.IO first (also saves to database)
    const newMessage = await messageService.handleNewMessage(messageData);
    
    // Also publish to RabbitMQ for additional processing or integration with other services
    if (messageService.rabbitInitialized) {
      await messageService.publishToRabbitMQ('chat_exchange', 'chat_messages', {
        ...messageData,
        _id: newMessage._id,
        source: 'api'
      });
    }
    
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update message status (read, delivered)
export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;
    
    if (!['sent', 'delivered', 'read'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Notify clients via Socket.IO
    const chatId = messageService.getChatId(message.sender, message.receiver);
    messageService.io.to(chatId).emit('message_status', {
      messageId: message._id,
      status,
      timestamp: new Date()
    });
    
    // Also publish to RabbitMQ
    if (messageService.rabbitInitialized) {
      await messageService.publishToRabbitMQ('chat_exchange', 'message_status', {
        messageId: message._id,
        status,
        timestamp: new Date(),
        sender: message.sender,
        receiver: message.receiver
      });
    }
    
    return res.status(200).json(message);
  } catch (error) {
    console.error('Error updating message status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body; // To ensure only sender can delete
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user is authorized to delete
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    await Message.findByIdAndDelete(messageId);
    
    // Notify clients via Socket.IO
    const chatId = messageService.getChatId(message.sender, message.receiver);
    messageService.io.to(chatId).emit('message_deleted', {
      messageId: message._id,
      timestamp: new Date()
    });
    
    // Also publish to RabbitMQ
    if (messageService.rabbitInitialized) {
      await messageService.publishToRabbitMQ('chat_exchange', 'message_deleted', {
        messageId: message._id,
        sender: message.sender,
        receiver: message.receiver,
        timestamp: new Date()
      });
    }
    
    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 