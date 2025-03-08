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
            // Ensure booking ID is always a valid string
            const booking: Booking = {
                ...bookingData,
                booking_id: bookingData.booking_id || crypto.randomUUID(), // Use `crypto.randomUUID()` for uniqueness
            }

            // Create the booking
            const response = await bookingApi.post("/bookings/", booking)

            // Fetch user info for notification
            const user = await userService.getUserById(booking.user_id).catch(() => null)

            if (user?.email) {
                // Send notification
                await notificationService.sendNotification({
                    recipient: user.email,
                    subject: "Booking Confirmation",
                    message: `Your booking (ID: ${booking.booking_id}) for ${booking.tickets} ticket(s) has been confirmed.`,
                }).catch((err) => console.error("Failed to send notification:", err))
            }

            return response.data
        } catch (error) {
            console.error("Failed to create booking:", error)
            throw new Error("Booking creation failed. Please try again.")
        }
    },

    getAllBookings: async () => {
        try {
            const response = await bookingApi.get("/bookings/")
            return response.data || []
        } catch (error) {
            console.error("Failed to fetch bookings:", error)
            return []
        }
    },
}
