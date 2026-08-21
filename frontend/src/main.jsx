import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,

    integrations: [Sentry.browserTracing(), Sentry.replay()],
    traces_sample_rate: 1.0,

    replays_session_sample_rate: 0.1, // On enregistre 10% des sessions.
    replays_on_error_sample_rate: 1.0, // Mais on enregistre 100% des sessions où une erreur survient.
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
