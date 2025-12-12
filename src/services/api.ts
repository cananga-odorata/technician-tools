import type { Vehicle, HistoryLog, AuthResponse, PaginatedResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    // Ensure we don't send "undefined" or "null" strings as tokens
    const validToken = token && token !== 'undefined' && token !== 'null';
    return {
        'Content-Type': 'application/json',
        ...(validToken ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response: Response) => {
    if (response.status === 401) {
        // Session expired or invalid token
        console.warn('Session expired or unauthorized, redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Use replace to prevent back-button looping
        window.location.replace('/login');

        // Throwing error to interrupt the promise chain
        throw new Error('Session expired');
    }
    if (!response.ok) {
        throw new Error(response.statusText || 'API request failed');
    }
    return response;
};

export const api = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error('Invalid server response: No access token received');
        }

        // The API returns { access_token: string }, we map it to our AuthResponse
        // We might need to fetch user details separately or decode the token if the API doesn't return user info.
        // For now, let's assume we construct a basic user object or the API returns it.
        // Based on Postman, it returns access_token. We'll mock the User object for now or extract from token.
        return {
            token: data.access_token,
            user: {
                id: data.user?.id || 1, // Use data.user if available, otherwise placeholder
                name: data.user?.name || username,
                email: data.user?.email || '',
                role_id: data.user?.role_id || data.role_id || 1,
                firstname: data.user?.firstname || 'Technician',
                lastname: data.user?.lastname || 'User',
                titlename: data.user?.titlename || 'Mr.',
                token: data.access_token
            }
        };
    },

    getVehicles: async (page = 1, limit = 8, search = ''): Promise<PaginatedResponse<Vehicle>> => {
        // Use the endpoint provided by the user
        const response = await fetch(`${BASE_URL}/technician/fleet-boxes?page=${page}&limit=${limit}&search=${search}`, {
            headers: getHeaders(),
        }).then(handleResponse);

        // handleResponse throws if !ok, so we can safely get json here

        const json = await response.json();
        const items = json.data || [];
        const meta = json.meta || { total: 0, page: 1, limit: limit, totalPages: 1 };

        // Map API response to Vehicle interface
        const vehicles = items.map((item: any) => ({
            id: item.fp_id || item.fb_id, // Use fp_id (Fleet Product) as primary ID, fallback to fb_id
            fb_id: item.fleet_box?.fb_id || item.fb_id,
            fp_id: item.fp_id,
            serial_number: item.serial_number, // Product Serial Number
            box_serial_number: item.fleet_box?.serial_number, // Control Box Serial Number
            model: item.product_name || item.fleet_product?.product_name || 'Unknown Model',
            model_code: item.model_code?.toString() || item.model?.toString() || '0',
            status: item.status === 1 ? 'active' : item.status === 2 ? 'maintenance' : 'inactive',
            battery_level: item.battery || item.fleet_product?.battery || 100,
            last_maintenance: item.updated_at || new Date().toISOString(),
            fleet_product: {
                fleet_name: item.fleet_name || item.fleet_product?.fleet_name,
                serial_number: item.serial_number,
                model_info: {
                    id: item.product_id,
                    name: item.product_name
                }
            },
            image: 'https://images.unsplash.com/photo-1532906619279-a7826040495f?auto=format&fit=crop&w=300&q=80' // Placeholder
        }));

        return { data: vehicles, meta };
    },

    getHistory: async (page = 1, limit = 10, startDate = '', endDate = '', search = ''): Promise<PaginatedResponse<HistoryLog>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (search) params.append('search', search);

        const url = `${BASE_URL}/technician/history?${params.toString()}`;
        // console.log('Fetching history from:', url);

        // console.log('Fetching history from:', url);

        try {
            const response = await fetch(url, {
                headers: getHeaders(),
            }).then(handleResponse);

            const data = await response.json();
            // console.log('History data:', data);
            return data;
        } catch (error) {
            console.warn('Failed to fetch history:', error);
            // If session expired, handleResponse would have thrown and redirected. 
            // If we catch it here, we might swallow the redirection if logic continues? 
            // handleResponse throws ERROR.
            // But we should propagate the error if it's session expired so the UI knows or just let the redirect happen.
            if (error instanceof Error && error.message === 'Session expired') {
                throw error;
            }
            return { data: [], meta: { total: 0, page: 1, limit: limit, totalPages: 1 } };
        }
    },

    // Helper function to avoid 'response' shadowing issues if we were to restructure differently,
    // but the above try/catch block replaces lines 98-109 cleanly.

    logAction: async (action: string, details: string, fb_id?: number, fp_id?: number): Promise<void> => {
        try {
            await fetch(`${BASE_URL}/technician/log`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ action, details, fb_id, fp_id })
            }).then(handleResponse);
        } catch (error) {
            console.error('Failed to log action', error);
        }
    }
};
