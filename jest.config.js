module.exports = {
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'json', 'js', 'jsx', 'node'],
  preset: 'ts-jest',
  testRegex: [
    '\\.test\\.ts$',
  ],
  testTimeout: 5000,
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
};