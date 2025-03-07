import { userApi } from './api-client';

export interface User {
    id?: string;
    username: string;
    email: string;
}

export interface UserCreate {
    username: string;
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export const userService = {
    register: async (userData: UserCreate) => {
        const response = await userApi.post('/register', userData);
        return response.data;
    },

    login: async (credentials: UserLogin) => {
        const response = await userApi.post('/login', credentials);
        localStorage.setItem('token', response.data.access_token);
        return response.data;
    },

    getProfile: async (email: string) => {
        const response = await userApi.get(`/profile?email=${email}`);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    // This would require an admin endpoint in the backend
    getAllUsers: async () => {
        // For now, we'll return a mock response since the backend doesn't have this endpoint
        return [
            { id: '1', username: 'admin', email: 'admin@example.com' },
            { id: '2', username: 'user1', email: 'user1@example.com' }
        ];
    }
};