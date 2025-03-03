import React, { useState } from "react";
import { createBooking } from "../services/api";

const BookingForm = ({ eventId }) => {
  const [tickets, setTickets] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const booking = {
        booking_id: `booking-${Date.now()}`,
        user_id: "user1", // Hardcoded for now
        event_id: eventId,
        tickets: tickets,
      };
      await createBooking(booking);
      setMessage("Booking confirmed successfully!");
    } catch (error) {
      setMessage("Failed to create booking.");
    }
  };

  return (
    <div>
      <h2>Book Tickets</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tickets:
          <input
            type="number"
            value={tickets}
            onChange={(e) => setTickets(Number(e.target.value))}
            min="1"
          />
        </label>
        <button type="submit">Book Now</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookingForm;