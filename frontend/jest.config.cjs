module.exports = {
  testEnvironment: 'jsdom', // Use JSDOM for testing React components
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Path to your setup file
  moduleNameMapper: {
    // Mock CSS Modules (if you use them)
    '\\.module\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    // Mock other static assets
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js', // If not CSS Modules
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest to transpile tests
  },
  // If you're using ES Modules in your tests or source files that Jest needs to process:
  // transformIgnorePatterns: [
  //   '/node_modules/(?!(your-es-module-dependency)/)', // Adjust as needed
  // ],
  // Or, if your source code is primarily ES Modules and you want Jest to handle .jsx as ESM:
  // extensionsToTreatAsEsm: ['.jsx'],
  // moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // Ensure jsx is processed
  // testMatch: [ // Default is fine for __tests__ or .test.js/jsx
  //   '**/__tests__/**/*.[jt]s?(x)',
  //   '**/?(*.)+(spec|test).[jt]s?(x)',
  // ],
  // verbose: true, // Optional: for more detailed output
};