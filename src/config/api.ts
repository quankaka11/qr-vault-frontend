// API Configuration
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 30000,
};

// Get full API URL
export const getApiUrl = (path: string) => {
    const baseUrl = API_CONFIG.baseURL.replace(/\/$/, ''); // Remove trailing slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
};

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
