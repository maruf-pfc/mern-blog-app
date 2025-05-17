import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Makes describe, it, expect, etc. globally available
    environment: "jsdom", // Use JSDOM for testing React components
    setupFiles: "./src/setupTests.js", // Path to your setup file
    // css: true, // if you want to test CSS (e.g. with @testing-library/jest-css-modules)
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json", "html"],
    },
  },
});
