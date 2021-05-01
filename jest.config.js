module.exports = {
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
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
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
  testRegex: ['\\.test\\.(ts|js)$'],
  testTimeout: 2500,
};
