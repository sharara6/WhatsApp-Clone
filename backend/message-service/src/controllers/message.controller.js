import axios from 'axios';
import Message from "../models/message.model.js";
import minioClient from "../lib/minio.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

/**
 * Helper function to fetch user details from user service
 */
const getUserById = async (userId, token) => {
  try {
    const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5001';
    const response = await axios.get(`${userServiceUrl}/api/users/${userId}`, {
      headers: {
        Cookie: `jwt=${token}`
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId} from user service:`, error.message);
    return null;
  }
};

export const getUsersForSidebar = async (req, res) => {
  try {
 
    const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5001';
    
    try {
     
      const response = await axios.get(`${userServiceUrl}/api/users`, {
        headers: {
          Cookie: req.headers.cookie || ''
        },
        withCredentials: true
      });
      
      
      const loggedInUserId = req.user._id;
      const filteredUsers = response.data.filter(user => user._id !== loggedInUserId);
      
      res.status(200).json(filteredUsers);
    } catch (error) {
      console.error("Error fetching users from user service:", error.message);
      return res.status(500).json({ error: "Failed to fetch users from user service" });
    }
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const token = req.cookies.jwt;
    const receiver = await getUserById(receiverId, token);
    
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    let imageUrl;
    if (image) {
      try {
        // Remove the data URL prefix if present
        const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `message-${Date.now()}.jpg`;
        
        // Upload to MinIO with metadata
        await minioClient.putObject('messages', fileName, buffer, {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': 'inline',
          'Cache-Control': 'public, max-age=31536000'
        });
        
        // Generate a presigned URL that's valid for 7 days
        imageUrl = await minioClient.presignedGetObject('messages', fileName, 7 * 24 * 60 * 60);
      } catch (error) {
        console.error('Error processing image:', error);
        return res.status(400).json({ error: 'Invalid image data' });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}; 