import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "@/assets/main.css";

// biome-ignore lint/style/noNonNullAssertion: intentional
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
