import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    // URL du frontend Vite.
    // Surchargeable en CI / en ligne via la variable d'env CYPRESS_BASE_URL.
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5173",
    setupNodeEvents(on, config) {
      // Événements Node (non utilisés ici)
    },
  },
});
