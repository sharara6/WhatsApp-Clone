import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import axios from 'axios';

interface Notification {
  type: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  currentNotification: Notification | null;
  showNotificationModal: boolean;
  setShowNotificationModal: (show: boolean) => void;
  clearCurrentNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { socket } = useSocket();

  // Get user name from sender ID
  const getUserName = async (userId: string): Promise<string> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        withCredentials: true
      });
      return response.data.fullName || response.data.username || 'Unknown User';
    } catch (error) {
      console.error('Error fetching user:', error);
      return 'Unknown User';
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNotification = async (notification: Omit<Notification, 'senderName'>) => {
      console.log('Notification received:', notification);
      
      // Get sender name
      const senderName = await getUserName(notification.senderId);
      
      const fullNotification = {
        ...notification,
        senderName
      };
      
      // Add to notifications list
      setNotifications(prev => [fullNotification, ...prev]);
      
      // Set as current notification
      setCurrentNotification(fullNotification);
      
      // Show notification modal
      setShowNotificationModal(true);
    };

    // Listen for notifications from the notification service
    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  const clearCurrentNotification = () => {
    setCurrentNotification(null);
    setShowNotificationModal(false);
  };

  const value = {
    notifications,
    currentNotification,
    showNotificationModal,
    setShowNotificationModal,
    clearCurrentNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 