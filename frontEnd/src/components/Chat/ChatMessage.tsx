import React, { useEffect, useState } from 'react';
import { useMQTT } from '../../context/MQTTContext';
import { TOPICS } from '../../services/mqtt/mqttClient';

interface Message {
    id: string;
    content: string;
    sender: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
}

interface ChatMessageProps {
    message: Message;
    isOwn: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn }) => {
    const [messageStatus, setMessageStatus] = useState(message.status);
    const { isConnected } = useMQTT();

    const getStatusIcon = () => {
        switch (messageStatus) {
            case 'sent':
                return '✓';
            case 'delivered':
                return '✓✓';
            case 'read':
                return '✓✓';
            default:
                return '⌛';
        }
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwn ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}
            >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                    </span>
                    {isOwn && (
                        <span className={`text-xs ${
                            messageStatus === 'read' ? 'text-blue-400' : 'opacity-70'
                        }`}>
                            {getStatusIcon()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}; 