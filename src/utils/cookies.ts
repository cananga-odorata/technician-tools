/**
 * Cookie utility functions for managing tsm authentication cookie
 * across subdomains (.tmh-wst.com)
 */

/**
 * Get cookie value by name
 * @param name - Cookie name to retrieve
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue || null;
    }
    return null;
};

/**
 * Delete cookie by setting expiry date to past
 * @param name - Cookie name to delete
 * @param domain - Optional domain (use .tmh-wst.com for subdomain sharing)
 */
export const deleteCookie = (name: string, domain?: string) => {
    const domainStr = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainStr}`;
};

/**
 * Check if tsm cookie exists and log for debugging
 * @returns true if tsm cookie exists
 */
export const hasTsmCookie = (): boolean => {
    const tsm = getCookie('tsm');
    console.log('[Cookie Debug] tsm cookie:', tsm ? 'EXISTS' : 'MISSING');
    console.log('[Cookie Debug] All cookies:', document.cookie);
    return !!tsm;
};

/**
 * Get all cookies as an object for debugging
 * @returns Object with all cookie key-value pairs
 */
export const getAllCookies = (): Record<string, string> => {
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[name] = value;
        }
    });
    return cookies;
};
