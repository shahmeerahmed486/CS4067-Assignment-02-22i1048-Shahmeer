import axios from 'axios';

// Base URLs for each service
const API_URLS = {
    user: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8001',
    event: process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || 'http://localhost:8002',
    booking: process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL || 'http://localhost:8003',
    notification: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 'http://localhost:8004'
};

// Create axios instances for each service with timeout
export const userApi = axios.create({
    baseURL: API_URLS.user,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000, // 5 second timeout
})

export const eventApi = axios.create({
    baseURL: API_URLS.event,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
})

export const bookingApi = axios.create({
    baseURL: API_URLS.booking,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
})

export const notificationApi = axios.create({
    baseURL: API_URLS.notification,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
})

// Add auth token interceptor for all services
const addAuthHeader = (config: any) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}

userApi.interceptors.request.use(addAuthHeader, (error) => Promise.reject(error))
eventApi.interceptors.request.use(addAuthHeader, (error) => Promise.reject(error))
bookingApi.interceptors.request.use(addAuthHeader, (error) => Promise.reject(error))
notificationApi.interceptors.request.use(addAuthHeader, (error) => Promise.reject(error))

// Add response interceptor to handle authentication errors
const handleAuthError = (error: any) => {
    if (error.response && error.response.status === 401) {
        // Clear token and redirect to login
        if (typeof window !== "undefined") {
            localStorage.removeItem("token")
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            window.location.href = "/login"
        }
    }
    return Promise.reject(error)
}

userApi.interceptors.response.use((response) => response, handleAuthError)
eventApi.interceptors.response.use((response) => response, handleAuthError)
bookingApi.interceptors.response.use((response) => response, handleAuthError)
notificationApi.interceptors.response.use((response) => response, handleAuthError)

