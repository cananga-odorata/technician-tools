import { createSignal, onCleanup, For } from 'solid-js';
import mqtt from 'mqtt';

interface HistoryItem {
    timestamp: string;
    topic: string;
    message: string;
    status: 'sent' | 'received' | 'error';
}

const BoardControl = () => {
    const [client, setClient] = createSignal<mqtt.MqttClient | null>(null);
    const [connectionStatus, setConnectionStatus] = createSignal<string>('Disconnected');
    const [brokerUrl, setBrokerUrl] = createSignal<string>('ws://broker.emqx.io:8083/mqtt');
    const [boardId, setBoardId] = createSignal<string>('');
    const [history, setHistory] = createSignal<HistoryItem[]>([]);

    const connect = () => {
        if (client()) {
            client()?.end();
            setClient(null);
            setConnectionStatus('Disconnected');
            return;
        }

        setConnectionStatus('Connecting...');
        const mqttClient = mqtt.connect(brokerUrl(), {
            clientId: `technician_tool_${Math.random().toString(16).substring(2, 8)}`,
        });

        mqttClient.on('connect', () => {
            setConnectionStatus('Connected');
            console.log('Connected to MQTT broker');
        });

        mqttClient.on('error', (err) => {
            setConnectionStatus(`Error: ${err.message}`);
            console.error('Connection error: ', err);
        });

        mqttClient.on('close', () => {
            if (connectionStatus() !== 'Disconnected') {
                setConnectionStatus('Disconnected');
            }
        });

        setClient(mqttClient);
    };

    onCleanup(() => {
        if (client()) {
            client()?.end();
        }
    });

    const addToHistory = (topic: string, message: string, status: 'sent' | 'received' | 'error') => {
        const newItem: HistoryItem = {
            timestamp: new Date().toLocaleTimeString(),
            topic,
            message,
            status,
        };
        setHistory((prev) => [newItem, ...prev]);
    };

    const sendCommand = (isOpen: boolean) => {
        if (!client() || !client()?.connected) {
            alert('Please connect to the broker first.');
            return;
        }
        if (!boardId()) {
            alert('Please enter a Board ID.');
            return;
        }

        const topic = `vehicle/${boardId()}/wrstatus`;
        const payload = JSON.stringify({
            model: 2,
            status: isOpen ? 1 : 0,
        });

        client()?.publish(topic, payload, { qos: 0 }, (error) => {
            if (error) {
                console.error('Publish error:', error);
                addToHistory(topic, payload, 'error');
            } else {
                console.log('Message sent:', topic, payload);
                addToHistory(topic, payload, 'sent');
            }
        });
    };

    return (
        <div class="p-6 max-w-4xl mx-auto space-y-8">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 class="text-xl font-bold text-slate-800 mb-4">MQTT Connection</h2>
                <div class="flex gap-4 items-end">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-slate-600 mb-1">Broker URL</label>
                        <input
                            type="text"
                            value={brokerUrl()}
                            onInput={(e) => setBrokerUrl(e.currentTarget.value)}
                            class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="ws://broker.emqx.io:8083/mqtt"
                        />
                    </div>
                    <button
                        onClick={connect}
                        class={`px-6 py-2 rounded-lg font-medium transition-all ${connectionStatus() === 'Connected'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                            }`}
                    >
                        {connectionStatus() === 'Connected' ? 'Disconnect' : 'Connect'}
                    </button>
                </div>
                <div class="mt-2 text-sm">
                    Status: <span class={`font-medium ${connectionStatus() === 'Connected' ? 'text-green-600' :
                            connectionStatus() === 'Disconnected' ? 'text-slate-500' : 'text-amber-600'
                        }`}>{connectionStatus()}</span>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 class="text-xl font-bold text-slate-800 mb-4">Board Control</h2>
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-600 mb-1">Board ID / Vehicle ID</label>
                        <input
                            type="text"
                            value={boardId()}
                            onInput={(e) => setBoardId(e.currentTarget.value)}
                            class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="e.g. 2510015"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => sendCommand(true)}
                            disabled={!client()?.connected || !boardId()}
                            class="group relative overflow-hidden bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                        >
                            <div class="relative z-10 flex flex-col items-center gap-2">
                                <span class="text-2xl font-bold">OPEN</span>
                                <span class="text-emerald-100 text-sm">Send Status 1</span>
                            </div>
                        </button>

                        <button
                            onClick={() => sendCommand(false)}
                            disabled={!client()?.connected || !boardId()}
                            class="group relative overflow-hidden bg-rose-500 hover:bg-rose-600 text-white p-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-200"
                        >
                            <div class="relative z-10 flex flex-col items-center gap-2">
                                <span class="text-2xl font-bold">CLOSE</span>
                                <span class="text-rose-100 text-sm">Send Status 0</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 class="text-xl font-bold text-slate-800 mb-4">Command History</h2>
                <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    <For each={history()}>
                        {(item) => (
                            <div class="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                <div class={`mt-1 w-2 h-2 rounded-full ${item.status === 'sent' ? 'bg-blue-500' :
                                        item.status === 'received' ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                <div class="flex-1 min-w-0">
                                    <div class="flex justify-between items-start mb-1">
                                        <span class="font-mono text-xs font-medium text-slate-500">{item.topic}</span>
                                        <span class="text-xs text-slate-400">{item.timestamp}</span>
                                    </div>
                                    <div class="font-mono text-sm text-slate-700 break-all">
                                        {item.message}
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>
                    {history().length === 0 && (
                        <div class="text-center py-8 text-slate-400 text-sm">
                            No commands sent yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoardControl;
