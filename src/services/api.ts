import type { Vehicle, HistoryLog, AuthResponse, PaginatedResponse } from '../types';
import { getCookie } from '../utils/cookies';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Legacy header getter - kept for backward compatibility
 * @deprecated Use authenticatedRequest() for automatic fallback
 */
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

/**
 * Helper: Fetch with JWT Token
 */
const fetchWithToken = async (url: string, token: string, options: RequestInit = {}): Promise<Response> => {
    console.log('[Auth] Attempting request with JWT token');
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });
};

/**
 * Helper: Fetch with Cookie Authentication
 */
const fetchWithCookie = async (url: string, options: RequestInit = {}): Promise<Response> => {
    console.log('[Auth] Attempting request with cookie authentication');
    return fetch(url, {
        ...options,
        credentials: 'include', // Send cookies automatically
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
};

/**
 * Hybrid Authenticated Request with automatic fallback
 * Strategy:
 * 1. Try JWT if available (fast, local validation)
 * 2. If JWT fails (401), try Cookie auth (Laravel session)
 * 3. If both fail, redirect to login
 */
const authenticatedRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('token');
    const tsmCookie = getCookie('tsm');

    // Strategy 1: Try JWT if available
    if (token) {
        try {
            const response = await fetchWithToken(url, token, options);

            if (response.ok) {
                console.log('[Auth] ✅ JWT authentication successful');
                return response;
            }

            if (response.status === 401) {
                console.warn('[Auth] ⚠️ JWT invalid or expired, trying cookie fallback...');
                localStorage.removeItem('token'); // Clear invalid JWT
                // Fall through to Strategy 2
            } else {
                // Other errors (500, 404, etc.) - don't fallback
                return response;
            }
        } catch (err) {
            console.error('[Auth] JWT request failed:', err);
            // Network error, try fallback
        }
    }

    // Strategy 2: Try Cookie if JWT failed or not available
    if (tsmCookie) {
        try {
            const response = await fetchWithCookie(url, options);

            if (response.ok) {
                console.log('[Auth] ✅ Cookie authentication successful');
                return response;
            }

            if (response.status === 401) {
                console.warn('[Auth] ❌ Cookie invalid, redirecting to login...');
                window.location.href = '/login';
                throw new Error('Authentication failed');
            }

            return response;
        } catch (err) {
            console.error('[Auth] Cookie request failed:', err);
            throw err;
        }
    }

    // No authentication available
    console.error('[Auth] ❌ No authentication available');
    window.location.href = '/login';
    throw new Error('No authentication available');
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
        // The API returns { access_token: string }, we map it to our AuthResponse
        // We might need to fetch user details separately or decode the token if the API doesn't return user info.
        // For now, let's assume we construct a basic user object or the API returns it.
        // Based on Postman, it returns access_token. We'll mock the User object for now or extract from token.
        return {
            token: data.access_token,
            user: {
                id: 1, // Placeholder
                name: username,
                email: '', // Not used anymore
                role_id: 1,
                firstname: 'Technician',
                lastname: 'User',
                titlename: 'Mr.',
                token: data.access_token
            }
        };
    },

    /**
     * Validate tsm cookie with backend
     * Returns user profile if cookie is valid
     * Uses credentials: 'include' to send cookies across domains
     */
    validateCookie: async (): Promise<{ user: any } | null> => {
        try {
            const response = await fetch(`${BASE_URL}/auth/cookie/profile`, {
                method: 'GET',
                credentials: 'include', // Essential for sending cookies cross-domain
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.warn('[Cookie Auth] Validation failed:', response.status);
                return null;
            }

            const data = await response.json();
            console.log('[Cookie Auth] Validation successful:', data);
            return data;
        } catch (error) {
            console.error('[Cookie Auth] Error:', error);
            return null;
        }
    },

    /**
     * Exchange Laravel session cookie for JWT
     * Sends the tsm session cookie to backend, which validates with Laravel
     * and returns a JWT token for technical portal use
     */
    exchangeSessionForJWT: async (sessionCookie: string): Promise<{ access_token: string; user: any } | null> => {
        try {
            console.log('[Session Exchange] Exchanging session cookie for JWT...');

            const response = await fetch(`${BASE_URL}/auth/exchange-session`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionCookie }),
            });

            if (!response.ok) {
                console.warn('[Session Exchange] Exchange failed:', response.status);
                return null;
            }

            const data = await response.json();
            console.log('[Session Exchange] Exchange successful, JWT received');
            return data;
        } catch (error) {
            console.error('[Session Exchange] Error:', error);
            return null;
        }
    },

    getVehicles: async (page = 1, limit = 8, search = ''): Promise<PaginatedResponse<Vehicle>> => {
        const url = `${BASE_URL}/technician/fleet-boxes?page=${page}&limit=${limit}&search=${search}`;
        const response = await authenticatedRequest(url);

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }

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
        const response = await authenticatedRequest(url);

        if (!response.ok) {
            console.warn('Failed to fetch history:', response.status, response.statusText);
            return { data: [], meta: { total: 0, page: 1, limit: limit, totalPages: 1 } };
        }

        const data = await response.json();
        return data;
    },

    logAction: async (action: string, details: string, fb_id?: number, fp_id?: number): Promise<void> => {
        const response = await authenticatedRequest(`${BASE_URL}/technician/log`, {
            method: 'POST',
            body: JSON.stringify({ action, details, fb_id, fp_id })
        });

        if (!response.ok) {
            console.error('Failed to log action');
        }
    }
};
