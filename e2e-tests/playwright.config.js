// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true, // Run tests in parallel
  reporter: "html", // Generates a nice HTML report
  use: {
    baseURL: "http://localhost:3000", // Frontend URL
    trace: "on-first-retry", // Record trace if test fails and retries
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  // Optionally, start web servers before tests
  // webServer: [
  //   {
  //     command: 'npm run start --prefix ../backend', // Adjust path if needed
  //     url: 'http://localhost:5001/api/posts', // Wait for backend
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 120 * 1000,
  //   },
  //   {
  //     command: 'npm run start --prefix ../frontend', // Adjust path if needed
  //     url: 'http://localhost:3000', // Wait for frontend
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 120 * 1000,
  //   }
  // ],
});
