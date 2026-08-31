// defineConfig provides editor help for Vite's configuration object.
import { defineConfig } from "vite";
// The React plugin teaches Vite how to transform JSX components.
import react from "@vitejs/plugin-react";

// This exported object configures both Vite and the Vitest test runner.
export default defineConfig({
  // The React plugin enables JSX and fast development updates.
  plugins: [react()],
  // These settings give automated tests a browser-like environment.
  test: {
    // jsdom supplies objects such as window, document, and localStorage.
    environment: "jsdom",
    // This file adds readable browser-interface assertions before tests begin.
    setupFiles: "./src/test/setup.js",
  },
});
