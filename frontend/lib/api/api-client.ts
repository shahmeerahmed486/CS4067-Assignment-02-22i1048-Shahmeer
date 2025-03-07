import axios from 'axios';

// Base URLs for each service
const API_URLS = {
    user: 'http://localhost:8000',
    event: 'http://localhost:8001',
    booking: 'http://localhost:8002',
    notification: 'http://localhost:8003'
};

// Create axios instances for each service
export const userApi = axios.create({
    baseURL: API_URLS.user,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const eventApi = axios.create({
    baseURL: API_URLS.event,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const bookingApi = axios.create({
    baseURL: API_URLS.booking,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const notificationApi = axios.create({
    baseURL: API_URLS.notification,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token interceptor for protected routes
userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);