import React, { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import EventList from "./components/EventList";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import Notification from "./components/Notification";

const App = () => {
  const [notification, setNotification] = useState("");

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/bookings">My Bookings</Link>
      </nav>
      <Notification message={notification} />
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/book/:eventId" element={<BookingForm setNotification={setNotification} />} />
        <Route path="/bookings" element={<BookingList />} />
      </Routes>
    </div>
  );
};

export default App;
