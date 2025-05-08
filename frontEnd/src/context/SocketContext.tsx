import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    notificationSocket: Socket | null;
    isNotificationConnected: boolean;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

interface SocketProviderProps {
    children: React.ReactNode;
    userId: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, userId }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notificationSocket, setNotificationSocket] = useState<Socket | null>(null);
    const [isNotificationConnected, setIsNotificationConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        // Connect to main socket.io server
        const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            query: { userId },
            withCredentials: true
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        setSocket(socketInstance);

        // Connect to notification service
        const notificationSocketInstance = io(import.meta.env.VITE_NOTIFICATION_URL || 'http://localhost:5003', {
            withCredentials: true
        });

        notificationSocketInstance.on('connect', () => {
            console.log('Notification socket connected');
            setIsNotificationConnected(true);
            
            // Register user ID with notification server
            notificationSocketInstance.emit('register', userId);
        });

        notificationSocketInstance.on('disconnect', () => {
            console.log('Notification socket disconnected');
            setIsNotificationConnected(false);
        });

        setNotificationSocket(notificationSocketInstance);

        return () => {
            socketInstance.disconnect();
            notificationSocketInstance.disconnect();
        };
    }, [userId]);

    const value = {
        socket,
        isConnected,
        notificationSocket,
        isNotificationConnected
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}; 