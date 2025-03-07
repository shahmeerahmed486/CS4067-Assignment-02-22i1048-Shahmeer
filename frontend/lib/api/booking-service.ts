import { bookingApi } from './api-client';

export interface Booking {
    booking_id: string;
    user_id: string;
    event_id: string;
    tickets: number;
    status?: string;
}

export const bookingService = {
    createBooking: async (bookingData: Booking) => {
        const response = await bookingApi.post('/bookings/', bookingData);
        return response.data;
    },

    getAllBookings: async () => {
        const response = await bookingApi.get('/bookings/');
        return response.data;
    }
};