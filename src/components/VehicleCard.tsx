import type { Component } from 'solid-js';
import { createSignal, onCleanup, createEffect, createResource } from 'solid-js';
import type { Vehicle, HistoryLog } from '../types';
import { api } from '../services/api';
import { mqttService } from '../services/mqttService';

interface VehicleCardProps {
    vehicle: Vehicle;
    id?: string;
}

const VehicleCard: Component<VehicleCardProps> = (props) => {
    const [status, setStatus] = createSignal<'connected' | 'disconnected'>('disconnected');
    const [lastCommand, setLastCommand] = createSignal<string | null>(null);
    const [isSerialExpanded, setIsSerialExpanded] = createSignal(false);
    const [isExpanded, setIsExpanded] = createSignal(false);
    const [isOnline, setIsOnline] = createSignal(false);
    let heartbeatTimeout: number;

    const [latestData, setLatestData] = createSignal<any[] | null>(null);
    const [lastUpdate, setLastUpdate] = createSignal<Date | null>(null);
    const [timeAgo, setTimeAgo] = createSignal<string>('');
    const [dataChanged, setDataChanged] = createSignal<{ [key: string]: boolean }>({});

    // Fetch recent history for this vehicle
    const [recentHistory] = createResource(
        () => props.vehicle.serial_number,
        async (serialNumber) => {
            if (!serialNumber) return { data: [], meta: { total: 0, page: 1, limit: 3, totalPages: 1 } };
            return api.getHistory(1, 2, '', '', serialNumber);
        }
    );

    // Parse data array into structured object
    const parsedData = () => {
        const data = latestData();
        if (!data || data.length !== 5) return null;
        return {
            mode: data[0],
            temp: data[1],
            voltage: data[2],
            total_usage_time: data[3],
            session_usage: data[4]
        };
    };

    createEffect(() => {
        const interval = setInterval(() => {
            const last = lastUpdate();
            if (last) {
                const diff = Math.floor((new Date().getTime() - last.getTime()) / 1000);
                setTimeAgo(`${diff}s ago`);
            }
        }, 1000);
        onCleanup(() => clearInterval(interval));
    });

    const mqttSerialNumber = props.vehicle.box_serial_number;
    const topic = mqttSerialNumber ? `vehicle/${mqttSerialNumber}/wrstatus` : '';
    const heartbeatTopic = mqttSerialNumber ? `vehicle/${mqttSerialNumber}/realtime_heartbeat` : '';

    const handleMessage = (t: string, message: Buffer) => {
        if (t === heartbeatTopic) {
            setIsOnline(true);
            setStatus('connected');
            try {
                const payload = JSON.parse(message.toString());
                if (payload.data && Array.isArray(payload.data)) {
                    const oldData = latestData();
                    const newData = payload.data;

                    // Track which fields changed
                    if (oldData && oldData.length === newData.length) {
                        const changed: { [key: string]: boolean } = {};
                        const fields = ['mode', 'temp', 'voltage', 'total_usage_time', 'session_usage'];
                        newData.forEach((val: any, idx: number) => {
                            if (val !== oldData[idx]) {
                                changed[fields[idx]] = true;
                            }
                        });
                        setDataChanged(changed);
                        setTimeout(() => setDataChanged({}), 1500);
                    }

                    setLatestData(newData);
                    setLastUpdate(new Date());
                    setTimeAgo('0s ago');
                }
            } catch (e) {
                console.error('Failed to parse heartbeat:', e);
            }

            if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
            heartbeatTimeout = window.setTimeout(() => {
                setIsOnline(false);
            }, 15000);
        }
    };

    createEffect(() => {
        if (mqttSerialNumber) {
            mqttService.subscribe(heartbeatTopic, handleMessage);
            setStatus(mqttService.getStatus() === 'connected' ? 'connected' : 'disconnected');
        }

        onCleanup(() => {
            if (mqttSerialNumber) {
                mqttService.unsubscribe(heartbeatTopic, handleMessage);
            }
            if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
        });
    });

    const sendCommand = (isOpen: boolean) => {
        if (!mqttSerialNumber) return;

        const payload = JSON.stringify({
            model: props.vehicle.model_code,
            status: isOpen ? 1 : 0
        });

        mqttService.publish(topic, payload, { qos: 0 });

        setLastCommand(isOpen ? 'OPEN' : 'CLOSE');
        api.logAction(
            isOpen ? 'OPEN_COMMAND' : 'CLOSE_COMMAND',
            `Sent ${isOpen ? 'OPEN' : 'CLOSE'} command to vehicle ${mqttSerialNumber}`,
            props.vehicle.fb_id,
            props.vehicle.fp_id
        );
        setTimeout(() => setLastCommand(null), 2000);
    };

    const getModeInfo = (mode: number) => {
        switch (mode) {
            case 0: return { label: 'Offline', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
            case 1: return { label: 'ทำงาน', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
            case 2: return { label: 'หยุด รีเลย์ 1', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
            case 3: return { label: 'หยุด รีเลย์ 2', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
            case 6: return { label: 'โหมด PM', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
            default: return { label: `Mode ${mode}`, color: 'text-text-secondary', bg: 'bg-tertiary', border: 'border-border-secondary' };
        }
    };

    return (
        <div id={props.id} class="bg-secondary rounded-2xl shadow-lg border border-border-primary hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Header Section */}
            <div class="p-5 pb-4 border-b border-border-secondary/50">
                <div class="flex items-start justify-between gap-4 mb-3">
                    <div class="flex-1 min-w-0">
                        <h3
                            class={`text-2xl font-bold text-text-primary mb-1.5 cursor-pointer hover:text-accent transition-colors ${isSerialExpanded() ? 'whitespace-normal break-all' : 'truncate'}`}
                            onClick={() => setIsSerialExpanded(!isSerialExpanded())}
                            title={props.vehicle.serial_number}
                        >
                            {props.vehicle.serial_number}
                        </h3>
                        <p
                            class={`text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors ${isExpanded() ? 'whitespace-normal' : 'truncate'
                                }`}
                            onClick={() => setIsExpanded(!isExpanded())}
                            title={props.vehicle.model}
                        >
                            {props.vehicle.model}
                        </p>
                    </div>

                    <span class={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${props.vehicle.status === 'active'
                        ? 'bg-green-500/15 text-green-500 border-green-500/30'
                        : props.vehicle.status === 'maintenance'
                            ? 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30'
                            : 'bg-red-500/15 text-red-500 border-red-500/30'
                        }`}>
                        {props.vehicle.status}
                    </span>
                </div>

                {/* Meta Information */}
                <div class="flex flex-wrap gap-2">
                    {props.vehicle.fleet_product?.fleet_name && (
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-tertiary/80 text-text-secondary border border-border-secondary">
                            <span class="opacity-70">🏢</span>
                            {props.vehicle.fleet_product.fleet_name}
                        </span>
                    )}
                    {props.vehicle.box_serial_number && (
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-tertiary/80 text-text-tertiary border border-border-secondary font-mono">
                            <span class="opacity-70">📦</span>
                            {props.vehicle.box_serial_number}
                        </span>
                    )}
                    <span class={`tour-status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status() === 'connected'
                        ? 'bg-green-500/15 text-green-500 border-green-500/30'
                        : 'bg-gray-500/15 text-gray-500 border-gray-500/30'
                        }`}>
                        <div class={`w-1.5 h-1.5 rounded-full ${isOnline()
                            ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                            : 'bg-gray-400'
                            }`}></div>
                        {status() === 'connected' ? 'Connected' : 'Offline'}
                    </span>
                </div>
            </div>

            {/* Live Data Section */}
            {isOnline() && (
                <div class="px-5 py-4 to-emerald-500/5 border-b border-border-secondary/30">
                    {/* <div class="px-5 py-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-b border-border-secondary/30"> */}
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <div class="relative flex h-2.5 w-2.5">
                                <span class={`absolute inline-flex h-full w-full rounded-full ${parsedData() ? 'animate-ping bg-green-400 opacity-75' : 'bg-yellow-400 opacity-40'
                                    }`}></span>
                                <span class={`relative inline-flex rounded-full h-2.5 w-2.5 ${parsedData() ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}></span>
                            </div>
                            <span class={`text-xs font-bold uppercase tracking-wider ${parsedData() ? 'text-green-500' : 'text-yellow-500'
                                }`}>
                                {parsedData() ? 'Live Telemetry' : 'Waiting...'}
                            </span>
                        </div>
                        {parsedData() && (
                            <span class="text-[10px] text-text-tertiary font-mono bg-background/50 px-2 py-0.5 rounded">
                                {timeAgo()}
                            </span>
                        )}
                    </div>

                    {parsedData() ? (
                        <div class="grid grid-cols-2 gap-3">
                            {/* Mode */}
                            <div class={`bg-background/60 rounded-lg p-3 border border-border-secondary/50 transition-all duration-300 ${dataChanged()['mode'] ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20 scale-105' : ''
                                }`}>
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-lg">⚙️</span>
                                    <span class="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Mode</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-2xl font-bold text-text-primary font-mono leading-none mb-1">{parsedData()?.mode}</span>
                                    <span class={`text-[10px] px-1.5 py-0.5 rounded border w-fit ${getModeInfo(parsedData()!.mode).bg} ${getModeInfo(parsedData()!.mode).color} ${getModeInfo(parsedData()!.mode).border}`}>
                                        {getModeInfo(parsedData()!.mode).label}
                                    </span>
                                </div>
                            </div>

                            {/* Temperature */}
                            <div class={`bg-background/60 rounded-lg p-3 border border-border-secondary/50 transition-all duration-300 ${dataChanged()['temp'] ? 'ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/20 scale-105' : ''
                                }`}>
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-lg">🌡️</span>
                                    <span class="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Temperature</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-2xl font-bold text-text-primary font-mono">{parsedData()?.temp}</span>
                                    <span class="text-sm text-text-secondary">°C</span>
                                </div>
                                <div class="mt-1 h-1.5 bg-border-secondary/30 rounded-full overflow-hidden">
                                    <div
                                        class={`h-full rounded-full transition-all duration-500 ${parsedData()!.temp > 40 ? 'bg-red-500' :
                                            parsedData()!.temp > 30 ? 'bg-orange-500' : 'bg-green-500'
                                            }`}
                                        style={`width: ${Math.min(100, (parsedData()!.temp / 50) * 100)}%`}
                                    ></div>
                                </div>
                            </div>

                            {/* Voltage */}
                            <div class={`bg-background/60 rounded-lg p-3 border border-border-secondary/50 transition-all duration-300 ${dataChanged()['voltage'] ? 'ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-500/20 scale-105' : ''
                                }`}>
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-lg">⚡</span>
                                    <span class="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Voltage</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-2xl font-bold text-text-primary font-mono">{parsedData()?.voltage}</span>
                                    <span class="text-sm text-text-secondary">V</span>
                                </div>
                                <div class="mt-1 h-1.5 bg-border-secondary/30 rounded-full overflow-hidden">
                                    <div
                                        class={`h-full rounded-full transition-all duration-500 ${parsedData()!.voltage < 20 ? 'bg-red-500' :
                                            parsedData()!.voltage < 22 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                        style={`width: ${Math.min(100, (parsedData()!.voltage / 30) * 100)}%`}
                                    ></div>
                                </div>
                            </div>

                            {/* Session Usage */}
                            <div class={`bg-background/60 rounded-lg p-3 border border-border-secondary/50 transition-all duration-300 ${dataChanged()['session_usage'] ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20 scale-105' : ''
                                }`}>
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-lg">⏱️</span>
                                    <span class="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Session</span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-2xl font-bold text-text-primary font-mono">
                                        {Math.floor(parsedData()!.session_usage / 60)}
                                    </span>
                                    <span class="text-sm text-text-secondary">m</span>
                                    <span class="text-lg font-bold text-text-primary font-mono ml-1">
                                        {parsedData()!.session_usage % 60}
                                    </span>
                                    <span class="text-sm text-text-secondary">s</span>
                                </div>
                            </div>

                            {/* Total Usage Time */}
                            <div class={`col-span-2 bg-background/60 rounded-lg p-3 border border-border-secondary/50 transition-all duration-300 ${dataChanged()['total_usage_time'] ? 'ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20 scale-105' : ''
                                }`}>
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-lg">📊</span>
                                    <span class="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Total Usage Time</span>
                                </div>
                                <div class="flex items-baseline gap-2">
                                    <span class="text-2xl font-bold text-text-primary font-mono">
                                        {Math.floor(parsedData()!.total_usage_time / 60)}
                                    </span>
                                    <span class="text-sm text-text-secondary">minutes</span>
                                    <span class="text-lg font-bold text-text-primary font-mono">
                                        {parsedData()!.total_usage_time % 60}
                                    </span>
                                    <span class="text-sm text-text-secondary">seconds</span>
                                    <span class="ml-auto text-xs text-text-tertiary bg-tertiary/50 px-2 py-1 rounded">
                                        {(parsedData()!.total_usage_time / 3600).toFixed(2)} hrs
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div class="font-mono text-xs text-text-secondary bg-background/60 px-3 py-2.5 rounded-lg border border-border-secondary/50 text-center">
                            Listening for heartbeat...
                        </div>
                    )}
                </div>
            )}


            {/* Recent History Section */}
            {recentHistory() && recentHistory()!.data.length > 0 && (
                <div class="px-5 pb-3">
                    <div class="bg-tertiary/30 rounded-xl border border-border-secondary/50 overflow-hidden">
                        <div class="px-3 py-2 border-b border-border-secondary/50 flex items-center justify-between">
                            <span class="text-xs font-bold text-text-secondary uppercase tracking-wider">Recent Activity</span>
                            <span class="text-[10px] text-text-tertiary bg-background/50 px-2 py-0.5 rounded">
                                {recentHistory()!.meta.total} total
                            </span>
                        </div>
                        <div class="divide-y divide-border-secondary/30">
                            {recentHistory()!.data.slice(0, 3).map((log: HistoryLog) => {
                                const isOpen = log.action.includes('OPEN');
                                return (
                                    <div class="px-3 py-2 hover:bg-background/30 transition-colors">
                                        <div class="flex items-center gap-2">
                                            <div class={`w-6 h-6 rounded-md flex items-center justify-center ${isOpen ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                                }`}>
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {isOpen ? (
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                    ) : (
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    )}
                                                </svg>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-xs font-medium text-text-primary truncate">{log.details}</p>
                                                <p class="text-[10px] text-text-tertiary">
                                                    {new Date(log.created_at).toLocaleString('th-TH', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Section */}
            <div class="p-5 space-y-4">
                <div class="tour-controls grid grid-cols-2 gap-4">
                    <button
                        onClick={() => sendCommand(true)}
                        disabled={status() !== 'connected'}
                        class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <div class="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300"></div>
                        <div class="relative p-4 flex flex-col items-center gap-2">
                            <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span class="text-emerald-600 font-bold text-sm">เปิดใช้งานรถ</span>
                            <span class="text-[10px] text-emerald-600/60 uppercase tracking-wider font-medium">Activate</span>
                        </div>
                    </button>

                    <button
                        onClick={() => sendCommand(false)}
                        disabled={status() !== 'connected'}
                        class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/10 border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <div class="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/5 transition-colors duration-300"></div>
                        <div class="relative p-4 flex flex-col items-center gap-2">
                            <div class="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </div>
                            <span class="text-rose-600 font-bold text-sm">ปิดใช้งานรถ</span>
                            <span class="text-[10px] text-rose-600/60 uppercase tracking-wider font-medium">Deactivate</span>
                        </div>
                    </button>
                </div>

                <a
                    href={`/history?search=${props.vehicle.serial_number}`}
                    class="tour-history-link flex items-center justify-center gap-2 py-3 text-sm font-medium text-text-secondary hover:text-accent hover:bg-tertiary/50 rounded-xl transition-all duration-200 border border-transparent hover:border-border-secondary group"
                >
                    <svg class="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    View History Log
                </a>
            </div>

            {/* Command Feedback */}
            {lastCommand() && (
                <div class="absolute top-4 right-4 bg-accent text-accent-text px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce z-20 flex items-center gap-2">
                    <span>{lastCommand()}</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
            )}
        </div>
    );
};

export default VehicleCard;