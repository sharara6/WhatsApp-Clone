import mqtt, { MqttClient } from 'mqtt';

const MQTT_BROKER_URL = import.meta.env.VITE_MQTT_BROKER_URL || 'ws://localhost:9001';

export const TOPICS = {
    CHAT_MESSAGES: 'whatsapp/messages',
    USER_STATUS: 'whatsapp/users/status',
    TYPING_STATUS: 'whatsapp/users/typing',
    MESSAGE_STATUS: 'whatsapp/messages/status'
};

class MQTTClient {
    private client: MqttClient | null = null;
    private messageHandlers: Map<string, Function[]> = new Map();

    connect(userId: string) {
        this.client = mqtt.connect(MQTT_BROKER_URL, {
            clientId: `whatsapp_web_${userId}_${Math.random().toString(16).slice(3)}`,
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000
        });

        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
            this.subscribeToTopics();
        });

        this.client.on('message', (topic, payload) => {
            try {
                const message = JSON.parse(payload.toString());
                const handlers = this.messageHandlers.get(topic) || [];
                handlers.forEach(handler => handler(message));
            } catch (error) {
                console.error('Error processing MQTT message:', error);
            }
        });

        this.client.on('error', (error) => {
            console.error('MQTT Error:', error);
        });

        this.client.on('offline', () => {
            console.log('MQTT Client is offline');
        });
    }

    private subscribeToTopics() {
        if (!this.client) return;

        Object.values(TOPICS).forEach(topic => {
            this.client?.subscribe(topic, (err) => {
                if (err) {
                    console.error(`Error subscribing to ${topic}:`, err);
                } else {
                    console.log(`Subscribed to ${topic}`);
                }
            });
        });
    }

    addMessageHandler(topic: string, handler: Function) {
        const handlers = this.messageHandlers.get(topic) || [];
        handlers.push(handler);
        this.messageHandlers.set(topic, handlers);
    }

    removeMessageHandler(topic: string, handler: Function) {
        const handlers = this.messageHandlers.get(topic) || [];
        const index = handlers.indexOf(handler);
        if (index > -1) {
            handlers.splice(index, 1);
            this.messageHandlers.set(topic, handlers);
        }
    }

    sendMessage(message: any) {
        if (!this.client) return false;

        try {
            this.client.publish(TOPICS.CHAT_MESSAGES, JSON.stringify(message), {
                qos: 1,
                retain: false
            });
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    }

    updateTypingStatus(userId: string, receiverId: string, isTyping: boolean) {
        if (!this.client) return;

        const typingUpdate = {
            userId,
            receiverId,
            isTyping,
            timestamp: new Date()
        };

        this.client.publish(TOPICS.TYPING_STATUS, JSON.stringify(typingUpdate), {
            qos: 0,
            retain: false
        });
    }

    updateUserStatus(userId: string, status: 'online' | 'offline') {
        if (!this.client) return;

        const statusUpdate = {
            userId,
            status,
            timestamp: new Date()
        };

        this.client.publish(TOPICS.USER_STATUS, JSON.stringify(statusUpdate), {
            qos: 1,
            retain: true
        });
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
            this.messageHandlers.clear();
        }
    }
}

export default new MQTTClient(); 