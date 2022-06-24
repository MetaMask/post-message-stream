module.exports = {
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  preset: 'ts-jest',
  // "resetMocks" resets all mocks, including mocked modules, to jest.fn(),
  // between each test case.
  resetMocks: true,
  // "restoreMocks" restores all mocks created using jest.spyOn to their
  // original implementations, between each test. It does not affect mocked
  // modules.
  restoreMocks: true,
  projects: [
    {
      displayName: 'runner: default',
      preset: 'ts-jest',
      testRegex: ['\\.test\\.(ts|js)$'],
      testPathIgnorePatterns: [
        '<rootDir>/src/WebWorker/*',
        '<rootDir>/src/window/*',
      ],
    },
    {
      displayName: 'runner: electron',
      preset: 'ts-jest',
      runner: '@jest-runner/electron',
      testEnvironment: '@jest-runner/electron/environment',
      testRegex: ['\\.test\\.(ts|js)$'],
      testPathIgnorePatterns: [
        '<rootDir>/src/node-thread/*',
        '<rootDir>/src/node-process/*',
      ],
    },
  ],
  testTimeout: 2500,
};
