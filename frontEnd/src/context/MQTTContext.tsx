import React, { createContext, useContext, useEffect, useState } from 'react';
import mqttClient, { TOPICS } from '../services/mqtt/mqttClient';

interface MQTTContextType {
    isConnected: boolean;
    sendMessage: (message: any) => boolean;
    updateTypingStatus: (userId: string, receiverId: string, isTyping: boolean) => void;
    updateUserStatus: (userId: string, status: 'online' | 'offline') => void;
}

const MQTTContext = createContext<MQTTContextType | null>(null);

export const useMQTT = () => {
    const context = useContext(MQTTContext);
    if (!context) {
        throw new Error('useMQTT must be used within a MQTTProvider');
    }
    return context;
};

interface MQTTProviderProps {
    children: React.ReactNode;
    userId: string;
}

export const MQTTProvider: React.FC<MQTTProviderProps> = ({ children, userId }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        mqttClient.connect(userId);

        const connectHandler = () => setIsConnected(true);
        const disconnectHandler = () => setIsConnected(false);

        mqttClient.addMessageHandler('connect', connectHandler);
        mqttClient.addMessageHandler('offline', disconnectHandler);

        mqttClient.updateUserStatus(userId, 'online');

        return () => {
            mqttClient.updateUserStatus(userId, 'offline');
            mqttClient.removeMessageHandler('connect', connectHandler);
            mqttClient.removeMessageHandler('offline', disconnectHandler);
            mqttClient.disconnect();
        };
    }, [userId]);

    const value = {
        isConnected,
        sendMessage: mqttClient.sendMessage.bind(mqttClient),
        updateTypingStatus: mqttClient.updateTypingStatus.bind(mqttClient),
        updateUserStatus: mqttClient.updateUserStatus.bind(mqttClient)
    };

    return (
        <MQTTContext.Provider value={value}>
            {children}
        </MQTTContext.Provider>
    );
}; 