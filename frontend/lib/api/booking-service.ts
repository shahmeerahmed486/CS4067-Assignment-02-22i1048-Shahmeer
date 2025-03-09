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
            // Create a minimal payload with only the required fields
            const payload = {
                user_id: bookingData.user_id,
                event_id: bookingData.event_id,
                tickets: Number(bookingData.tickets),
                // Let the API handle defaults for booking_id and status
            }

            console.log("🚀 Sending booking request:", payload)

            // Create the booking
            const response = await bookingApi.post("/bookings/", payload)

            // Fetch user info for notification
            const user = await userService.getUserById(payload.user_id).catch(() => null)

            if (user?.email) {
                // Send notification
                await notificationService
                    .sendNotification({
                        recipient: user.email,
                        subject: "Booking Confirmation",
                        message: `Your booking for ${payload.tickets} ticket(s) has been confirmed.`,
                    })
                    .catch((err) => console.error("Failed to send notification:", err))
            }

            return response.data
        } catch (error: any) {
            // Log the detailed error response for debugging
            if (error.response) {
                console.error("Error response:", {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                })
            }
            console.error("Failed to create booking:", error)
            throw error
        }
    },
}


