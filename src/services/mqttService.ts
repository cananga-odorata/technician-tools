import mqtt from 'mqtt';
import { mqttConfig } from '../config/mqtt';
import { createSignal } from 'solid-js';

type MessageHandler = (topic: string, message: Buffer) => void;

// Create a reactive signal for connection status outside the class
// to avoid complexity with 'this' binding if passed around, 
// though valid as class property too.
const [isConnectedSignal, setIsConnectedSignal] = createSignal(false);

class MQTTService {
    private client: mqtt.MqttClient | null = null;
    private subscribers: Map<string, Set<MessageHandler>> = new Map();
    // private isConnected = false; // logic moved to signal

    get isConnected() {
        return isConnectedSignal();
    }

    constructor() {
        // Private constructor to enforce singleton usage if we wanted strict singleton,
        // but exporting an instance is easier in JS/TS.
    }

    connect() {
        if (this.client?.connected) return;

        console.log('Initializing shared MQTT connection...');
        this.client = mqtt.connect(mqttConfig.url, mqttConfig.options);

        this.client.on('connect', () => {
            console.log('Shared MQTT Connected');
            setIsConnectedSignal(true);
            // Resubscribe to all topics if we reconnected
            this.subscribers.forEach((_, topic) => {
                this.client?.subscribe(topic, (err) => {
                    if (err) console.error(`Failed to resubscribe to ${topic}:`, err);
                });
            });
        });

        this.client.on('message', (topic, message) => {
            const handlers = this.subscribers.get(topic);
            if (handlers) {
                handlers.forEach(handler => handler(topic, message));
            }
        });

        this.client.on('error', (err) => {
            console.error('Shared MQTT Error:', err);
        });

        this.client.on('close', () => {
            console.log('Shared MQTT Disconnected');
            setIsConnectedSignal(false);
        });
    }

    subscribe(topic: string, handler: MessageHandler) {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, new Set());
            // Only actually subscribe if we are connected, otherwise 'connect' handler will do it
            if (this.isConnected && this.client) {
                this.client.subscribe(topic, (err) => {
                    if (err) console.error(`Failed to subscribe to ${topic}:`, err);
                });
            }
        }
        this.subscribers.get(topic)?.add(handler);

        // If not connected, ensure we connect
        if (!this.client) {
            this.connect();
        } else if (this.isConnected) {
            // Ensure subscription happens if we added a new topic to an existing connection
            this.client.subscribe(topic);
        }
    }

    unsubscribe(topic: string, handler: MessageHandler) {
        const handlers = this.subscribers.get(topic);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.subscribers.delete(topic);
                if (this.isConnected && this.client) {
                    this.client.unsubscribe(topic);
                }
            }
        }
    }

    publish(topic: string, message: string | Buffer, options?: mqtt.IClientPublishOptions) {
        if (this.isConnected && this.client) {
            this.client.publish(topic, message, options || {}, (err) => {
                if (err) console.error(`Failed to publish to ${topic}:`, err);
            });
        } else {
            console.warn('Cannot publish: MQTT not connected');
        }
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
            setIsConnectedSignal(false);
        }
    }

    getStatus() {
        return this.isConnected ? 'connected' : 'disconnected';
    }
}

export const mqttService = new MQTTService();
// Export the signal accessor directly for easy use in components
export const isMqttConnected = isConnectedSignal;
