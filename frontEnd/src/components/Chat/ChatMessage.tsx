import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';

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
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Listen for message status updates
        const handleStatusUpdate = (data: { messageId: string; status: 'sent' | 'delivered' | 'read' }) => {
            if (data.messageId === message.id) {
                setMessageStatus(data.status);
            }
        };

        socket.on('messageStatusUpdate', handleStatusUpdate);

        // If this is a received message, mark it as delivered
        if (!isOwn && messageStatus === 'sent') {
            socket.emit('messageDelivered', { messageId: message.id });
        }

        // If this is a received message and it's in view, mark it as read
        if (!isOwn && messageStatus === 'delivered') {
            socket.emit('messageRead', { messageId: message.id });
        }

        return () => {
            socket.off('messageStatusUpdate', handleStatusUpdate);
        };
    }, [socket, isConnected, message.id, isOwn, messageStatus]);

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