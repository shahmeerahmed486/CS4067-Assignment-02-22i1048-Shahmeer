import { bookingApi } from "./api-client"
import { notificationService } from "./notification-service"
import { userService } from "./user-service"

export interface Booking {
    booking_id: string
    user_id: string
    event_id: string
    tickets: number
    status?: string
}

export const bookingService = {
    createBooking: async (bookingData: Omit<Booking, "booking_id"> & { booking_id?: string }) => {
        try {
            // Generate a random ID if not provided
            const booking = {
                ...bookingData,
                booking_id: bookingData.booking_id || Math.random().toString(36).substring(2, 15),
            }

            // Create the booking
            const response = await bookingApi.post("/bookings/", booking)

            // Get user information for notification
            const user = await userService.getUserById(booking.user_id)

            if (user && user.email) {
                // Automatically send a notification
                await notificationService.sendNotification({
                    recipient: user.email,
                    subject: "Booking Confirmation",
                    message: `Your booking (ID: ${booking.booking_id}) for ${booking.tickets} ticket(s) has been confirmed.`,
                })
            }

            return response.data
        } catch (error) {
            console.error("Failed to create booking:", error)
            throw error
        }
    },

    getAllBookings: async () => {
        try {
            const response = await bookingApi.get("/bookings/")
            return response.data || []
        } catch (error) {
            console.error("Failed to get all bookings:", error)
            // Return fallback data
            return []
        }
    },
}

