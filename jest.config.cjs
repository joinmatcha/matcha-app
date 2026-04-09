/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.stories.{ts,tsx}',
    '!src/assets/**',
    '!src/types/**',
    '!src/features/*/index.ts',
    '!src/features/*/index.tsx',
    '!src/App.tsx',
    '!src/navigation/**',
    '!src/constants/**',
    '!src/config/**',
    '!src/features/**/screens/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'json-summary', 'html'],
};
