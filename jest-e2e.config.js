/* eslint-disable */

require('dotenv').config({ path: '.env.e2e' });

module.exports = {
  displayName: 'smart-savings-api-e2e',
  preset: './jest.preset.js',
  globalSetup: '<rootDir>/e2e/scripts/global-setup.ts',
  globalTeardown: '<rootDir>/e2e/scripts/global-teardown.ts',
  setupFiles: ['<rootDir>/e2e/scripts/test-setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage/smart-savings-api-e2e',
  testMatch: ['<rootDir>/src/**/*(*.)@(itest).[jt]s?(x)'],
};
