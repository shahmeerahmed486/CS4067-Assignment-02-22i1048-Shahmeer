import React, { useEffect, useState } from "react";
import { fetchBookings } from "../services/api";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getBookings = async () => {
      const data = await fetchBookings();
      setBookings(data);
    };
    getBookings();
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.booking_id}>
            <p>Booking ID: {booking.booking_id}</p>
            <p>Event ID: {booking.event_id}</p>
            <p>Tickets: {booking.tickets}</p>
            <p>Status: {booking.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;