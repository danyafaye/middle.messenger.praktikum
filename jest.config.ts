import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@api(.*)$': '<rootDir>/src/api$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@framework(.*)$': '<rootDir>/src/framework$1',
    '^@models(.*)$': '<rootDir>/src/models$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@router(.*)$': '<rootDir>/src/router$1',
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@store(.*)$': '<rootDir>/src/store$1',
    '^@styles(.*)$': '<rootDir>/src/styles$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};

export default config;
