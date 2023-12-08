/* eslint-disable */
export default {
  displayName: 'smart-savings-api-e2e',
  preset: '../jest.preset.js',
  globalSetup: '<rootDir>/scripts/global-setup.ts',
  globalTeardown: '<rootDir>/scripts/global-teardown.ts',
  setupFiles: ['<rootDir>/scripts/test-setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/smart-savings-api-e2e',
};
