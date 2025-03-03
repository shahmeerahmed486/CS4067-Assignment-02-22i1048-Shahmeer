import React from "react";

const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{ padding: "10px", background: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" }}>
      {message}
    </div>
  );
};

export default Notification;