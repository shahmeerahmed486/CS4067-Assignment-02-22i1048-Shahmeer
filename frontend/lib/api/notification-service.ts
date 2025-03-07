import { notificationApi } from './api-client';

export interface Notification {
    id: string;
    recipient: string;
    subject: string;
    message: string;
    timestamp: string;
}

export const notificationService = {
    getAllNotifications: async () => {
        const response = await notificationApi.get('/notifications/');
        return response.data.notifications;
    },

    checkHealth: async () => {
        const response = await notificationApi.get('/health/');
        return response.data;
    }
};