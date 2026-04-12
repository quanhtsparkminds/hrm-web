import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { storage, StorageKeys } from '@/lib/storage';
import { store } from '@/store';
import { setLoading } from '@/store/slices/UiSlice';

// Global loading overlay is now handled manually for specific major actions (Login, Signup, Logout)
// to provide a better user experience for quick dashboard interactions.

export class ApiError extends Error {
    errorCode: string;
    constructor(message: string, errorCode: string) {
        super(message);
        this.errorCode = errorCode;
        this.name = 'ApiError';
    }
}

/**
 * Interface representing the standard API response structure
 * provided by the backend for both collections and single objects.
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errorCode: string;
    timestamp: number;
    metadata?: PaginationMetadata;
}

/**
 * Interface for pagination metadata
 */
export interface PaginationMetadata {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

/**
 * Custom Axios instance with pre-configured base URL and timeout
 */
const api = axios.create({
    // Use VITE_API_BASE_URL from .env if available, otherwise default to localhost
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://172.16.1.8:8001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000,
});

/**
 * Request Interceptor: Attach bearer token to every request if it exists in localStorage
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = storage.getString(StorageKeys.token);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor: Extract data and handle errors globally
 */
api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => {
        const { data } = response;

        // Handle cases where the backend returns success: false explicitly in the body
        if (data && data.success === false) {
            return Promise.reject(new ApiError(data.message || 'API Error occurred', data.errorCode));
        }

        return response;
    },
    (error: AxiosError<ApiResponse<any>>) => {
        // Detailed error logging & handling based on status codes
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized: Clear tokens
                    storage.delete(StorageKeys.token);
                    storage.delete(StorageKeys.refreshToken);
                    // Optional: window.location.href = '/login';
                    break;
                case 403:
                    console.error('[API Forbidden]: You do not have permission.');
                    break;
                case 404:
                    console.error('[API Not Found]: The requested resource does not exist.');
                    break;
                case 500:
                    console.error('[API Server Error]: Internal server error.');
                    break;
            }

            // Return the message from backend if available, otherwise generic error
            return Promise.reject(new ApiError(data?.message || error.message || 'Server Error', data?.errorCode || ''));
        }

        // Handle Network errors or Timeouts
        return Promise.reject(new Error(error.message || 'Network Error'));
    }
);

/**
 * Utility wrapper for common request types that automatically 
 * extracts the 'data' part of the response for cleaner caller code.
 * 
 * Usage example:
 * const users = await request.get<User[]>('/users');
 * console.log(users.data); // typed as User[]
 * console.log(users.metadata); // pagination info
 */
export const request = {
    get: <T>(url: string, config = {}) =>
        api.get<ApiResponse<T>>(url, config).then((res) => res.data),

    post: <T>(url: string, body?: any, config = {}) =>
        api.post<ApiResponse<T>>(url, body, config).then((res) => res.data),

    put: <T>(url: string, body?: any, config = {}) =>
        api.put<ApiResponse<T>>(url, body, config).then((res) => res.data),

    delete: <T>(url: string, config = {}) =>
        api.delete<ApiResponse<T>>(url, config).then((res) => res.data),

    patch: <T>(url: string, body?: any, config = {}) =>
        api.patch<ApiResponse<T>>(url, body, config).then((res) => res.data),
};

export default api;
