import { userApi } from './api-client';

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    createdAt: string;
    avatar?: string;
};

export interface UserCreate {
    username: string;
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

const mockUsers: User[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin",
        status: "active",
        createdAt: "2023-01-01T00:00:00Z",
        avatar: "https://via.placeholder.com/150",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "User",
        status: "inactive",
        createdAt: "2023-02-01T00:00:00Z",
        avatar: "https://via.placeholder.com/150",
    },
    // Add more mock users as needed
];

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

    getAllUsers: async (): Promise<User[]> => {
        // Simulate an API call with a delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockUsers);
            }, 1000);
        });
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};