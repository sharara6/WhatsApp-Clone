import React, { useState, useEffect, useRef } from 'react';
import { useMQTT } from '../../context/MQTTContext';

interface ChatInputProps {
    userId: string;
    receiverId: string;
    onSendMessage: (content: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    userId,
    receiverId,
    onSendMessage
}) => {
    const [message, setMessage] = useState('');
    const { updateTypingStatus } = useMQTT();
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    const handleTyping = () => {
        updateTypingStatus(userId, receiverId, true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            updateTypingStatus(userId, receiverId, false);
        }, 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        onSendMessage(message.trim());
        setMessage('');
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        updateTypingStatus(userId, receiverId, false);
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            updateTypingStatus(userId, receiverId, false);
        };
    }, [userId, receiverId]);

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
            <input
                type="text"
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:border-blue-500"
            />
            <button
                type="submit"
                disabled={!message.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
                Send
            </button>
        </form>
    );
}; 