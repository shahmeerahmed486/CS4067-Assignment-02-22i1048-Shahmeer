import axios from "axios";

const BASE_URL = "http://localhost:8001"; // Event Service
const BOOKING_URL = "http://localhost:8002"; // Booking Service

export const fetchEvents = async () => {
  const response = await axios.get(`${BASE_URL}/events/`);
  return response.data;
};

export const createBooking = async (booking) => {
  const response = await axios.post(`${BOOKING_URL}/bookings/`, booking);
  return response.data;
};

export const fetchBookings = async () => {
  const response = await axios.get(`${BOOKING_URL}/bookings/`);
  return response.data;
};