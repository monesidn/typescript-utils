/** @type {import('jest').Config} */
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    roots: ["test"]
};

module.exports = config;
