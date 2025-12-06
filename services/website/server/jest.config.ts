export default {
  displayName: 'server',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/services/website/server',
  testMatch: [
    '<rootDir>/test/**/*.spec.ts',
    '<rootDir>/src/**/*.spec.ts',
  ],
  moduleNameMapper: {
    '^apis$': '<rootDir>/../../../libraries/apis/src/index.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup/testSetup.ts'],
};
