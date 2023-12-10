/* eslint-disable */
export default {
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
  testMatch: [
    '<rootDir>/e2e/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/e2e/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};
