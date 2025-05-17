module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"], // For global test setup
  // preset: "@shelf/jest-mongodb", // Or configure mongodb-memory-server manually in setup.js
};
