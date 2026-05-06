import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
/* Interaction tokens + ix-sweep must load before index.css so lazy chunks see --ix-* vars */
import "./components/styles/interactions.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
