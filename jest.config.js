/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "app/**/*.{js,ts,tsx}",
    "lib/**/*.{js,ts,tsx}",
    "components/**/*.{js,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
}

module.exports = config
