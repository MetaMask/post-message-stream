// const tsPreset = require('ts-jest/jest-preset');

module.exports = {
  preset: 'ts-jest',
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'json', 'js', 'jsx', 'node'],
  testRegex: [
    '\\.test\\.ts$',
  ],
  testTimeout: 5000,
};
