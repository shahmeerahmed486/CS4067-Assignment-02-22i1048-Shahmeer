import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };
    getEvents();
  }, []);

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.event_id}>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <p>Tickets Available: {event.available_tickets}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;