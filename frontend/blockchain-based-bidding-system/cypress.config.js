import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // URL where your Vite app runs
    video: true, // We turn this ON to record evidence for the client
    supportFile: false, // Add this line to ignore the missing support file
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
});