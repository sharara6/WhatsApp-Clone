import mqttClient, { TOPICS } from './mqtt.js';
import Message from '../models/message.model.js';

class MessageService {
    constructor() {
        this.setupMessageHandlers();
    }

    setupMessageHandlers() {
        mqttClient.on('message', async (topic, payload) => {
            try {
                const message = JSON.parse(payload.toString());
                
                switch (topic) {
                    case TOPICS.CHAT_MESSAGES:
                        await this.handleChatMessage(message);
                        break;
                    case TOPICS.USER_STATUS:
                        await this.handleUserStatus(message);
                        break;
                    case TOPICS.TYPING_STATUS:
                        await this.handleTypingStatus(message);
                        break;
                    default:
                        console.log(`Unhandled topic: ${topic}`);
                }
            } catch (error) {
                console.error('Error processing MQTT message:', error);
            }
        });
    }

    async handleChatMessage(message) {
        try {
            const newMessage = new Message({
                sender: message.sender,
                receiver: message.receiver,
                content: message.content,
                type: message.type,
                timestamp: message.timestamp || new Date(),
                status: 'delivered'
            });
            await newMessage.save();

            this.publishMessageStatus({
                messageId: newMessage._id,
                status: 'delivered',
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error handling chat message:', error);
        }
    }

    handleUserStatus(statusUpdate) {
        console.log('User status update:', statusUpdate);
    }

    handleTypingStatus(typingUpdate) {
        console.log('Typing status update:', typingUpdate);
    }

    async sendMessage(message) {
        try {
            mqttClient.publish(TOPICS.CHAT_MESSAGES, JSON.stringify(message), {
                qos: 1, //at least once delivery
                retain: false
            });
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    }

    publishMessageStatus(statusUpdate) {
        const topic = `${TOPICS.CHAT_MESSAGES}/status/${statusUpdate.messageId}`;
        mqttClient.publish(topic, JSON.stringify(statusUpdate), {
            qos: 1,
            retain: false
        });
    }

    updateUserStatus(userId, status) {
        const statusUpdate = {
            userId,
            status,
            timestamp: new Date()
        };
        mqttClient.publish(TOPICS.USER_STATUS, JSON.stringify(statusUpdate), {
            qos: 1,
            retain: true
        });
    }

    sendTypingStatus(userId, receiverId, isTyping) {
        const typingUpdate = {
            userId,
            receiverId,
            isTyping,
            timestamp: new Date()
        };
        mqttClient.publish(TOPICS.TYPING_STATUS, JSON.stringify(typingUpdate), {
            qos: 0, 
            retain: false
        });
    }
}

export default new MessageService(); 