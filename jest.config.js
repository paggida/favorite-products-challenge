const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
const { name } = require('./package.json');

module.exports = {
  displayName: name,
  name,
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // An array of file extensions your modules use
  moduleFileExtensions : ['ts','tsx','js'],
  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src/" }),
  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: [
    '<rootDir>/src/config/tests.ts'
  ],
  // The test environment that will be used for testing
  testEnvironment: 'node',
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "<rootDir>/src/**/*.spec.ts",
  ],
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
