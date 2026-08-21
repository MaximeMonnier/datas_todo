import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import * as Sentry from "@sentry/react";

// Sentry demarre des qu'un DSN est fourni : en production via .env.production,
// et en local si on ajoute VITE_SENTRY_DSN a .env (pratique pour tester).
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE, // "development" ou "production" dans Sentry

    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 1.0,

    replaysSessionSampleRate: 0.1, // On enregistre 10% des sessions.
    replaysOnErrorSampleRate: 1.0, // Mais on enregistre 100% des sessions où une erreur survient.
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
