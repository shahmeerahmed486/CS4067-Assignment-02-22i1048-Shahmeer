import React from "react";
import { createRoot } from "react-dom/client"; // Updated import for React 19
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// Create a root element and render the app
const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);