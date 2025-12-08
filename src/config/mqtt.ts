import type { IClientOptions } from 'mqtt';

export const mqttConfig = {
    url: import.meta.env.VITE_MQTT_BROKER_URL || 'ws://broker.emqx.io:8083/mqtt',
    options: {
        username: import.meta.env.VITE_MQTT_USERNAME || '',
        password: import.meta.env.VITE_MQTT_PASSWORD || '',
        clientId: `technician_tool_${Math.random().toString(16).substring(2, 8)}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 10000,
    } as IClientOptions
};
