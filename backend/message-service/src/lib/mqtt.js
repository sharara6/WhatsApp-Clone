import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const MQTT_OPTIONS = {
    clientId: `whatsapp_clone_${Math.random().toString(16).slice(3)}`,
    clean: true,
    connectTimeout: 4000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000,
};

export const TOPICS = {
    CHAT_MESSAGES: 'whatsapp/messages',
    USER_STATUS: 'whatsapp/users/status',
    TYPING_STATUS: 'whatsapp/users/typing',
};

// mqtt client
const client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    Object.values(TOPICS).forEach(topic => {
        client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Error subscribing to ${topic}:`, err);
            } else {
                console.log(`Subscribed to ${topic}`);
            }
        });
    });
});

client.on('error', (error) => {
    console.error('MQTT Error:', error);
});

client.on('offline', () => {
    console.log('MQTT Client is offline');
});

client.on('reconnect', () => {
    console.log('MQTT Client is trying to reconnect');
});

export default client; 