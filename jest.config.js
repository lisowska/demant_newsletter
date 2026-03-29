const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^models/(.*)$': '<rootDir>/src/models/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^images/(.*)$': '<rootDir>/src/images/$1',
    // Override next/jest default SVG → fileMock (object); SVGR imports need a component.
    '^.+\\.(svg)$': '<rootDir>/tests/mocks/svgComponentMock.js',
    '\\.(png|jpg|jpeg|gif|webp|avif)$': '<rootDir>/tests/mocks/fileMock.js',
  },
};

module.exports = createJestConfig(customJestConfig);
