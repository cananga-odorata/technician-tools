export interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    firstname: string;
    lastname: string;
    titlename: string;
    token?: string;
}

export interface Vehicle {
    id: number;
    fb_id?: number;
    fp_id?: number;
    serial_number: string;
    box_serial_number?: string;
    model: string;
    status: 'active' | 'inactive' | 'maintenance';
    battery_level: number;
    last_maintenance: string;
    fleet_product?: {
        fleet_name?: string;
        serial_number?: string;
        model_info?: {
            id: number;
            name: string;
            model_code: string;
        };
    };
    model_code: string;
    image?: string;
}

export interface HistoryLog {
    id: number;
    user_id: number;
    fb_id: number | null;
    fp_id: number | null;
    action: string;
    details: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
    user?: User;
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: Meta;
}

export interface AuthResponse {
    user: User;
    token: string;
}
