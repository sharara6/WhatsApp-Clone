import React, { useEffect, useState, useRef } from 'react';
import { useMQTT } from '../../context/MQTTContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import mqttClient, { TOPICS } from '../../services/mqtt/mqttClient';

interface Message {
    id: string;
    content: string;
    sender: string;
    receiver: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
}

interface ChatContainerProps {
    userId: string;
    receiverId: string;
    receiverName: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
    userId,
    receiverId,
    receiverName
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const { sendMessage, isConnected } = useMQTT();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            if (
                (message.sender === userId && message.receiver === receiverId) ||
                (message.sender === receiverId && message.receiver === userId)
            ) {
                setMessages(prev => [...prev, message]);
            }
        };

        const handleTypingStatus = (status: { userId: string; isTyping: boolean }) => {
            if (status.userId === receiverId) {
                setIsTyping(status.isTyping);
            }
        };

        mqttClient.addMessageHandler(TOPICS.CHAT_MESSAGES, handleNewMessage);
        mqttClient.addMessageHandler(TOPICS.TYPING_STATUS, handleTypingStatus);

        return () => {
            mqttClient.removeMessageHandler(TOPICS.CHAT_MESSAGES, handleNewMessage);
            mqttClient.removeMessageHandler(TOPICS.TYPING_STATUS, handleTypingStatus);
        };
    }, [userId, receiverId]);

    const handleSendMessage = (content: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content,
            sender: userId,
            receiver: receiverId,
            timestamp: new Date(),
            status: 'sent'
        };

        sendMessage(newMessage);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-white">
                <h2 className="text-lg font-semibold">{receiverName}</h2>
                {isTyping && (
                    <p className="text-sm text-gray-500">typing...</p>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        isOwn={message.sender === userId}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput
                userId={userId}
                receiverId={receiverId}
                onSendMessage={handleSendMessage}
            />

            {!isConnected && (
                <div className="p-2 bg-yellow-100 text-yellow-800 text-center">
                    Connecting to chat...
                </div>
            )}
        </div>
    );
}; 