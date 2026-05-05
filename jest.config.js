/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    testTimeout: 30000,
    verbose: true,
    collectCoverageFrom: [
        'src/models/queries.model.ts',
        'src/controllers/**/*.ts',
    ],
    coverageDirectory: 'coverage',
};
