/** @type {import('jest').Config} */
const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	setupFilesAfterEnv: [ "<rootDir>/jest/setupTests.js" ],
	moduleNameMapper: {
		"\\.css$": "<rootDir>/jest/__mocks__/styleMock.js",
	},
	collectCoverageFrom: [
		"src/**/*.{js,jsx,ts,tsx}",
	],
	coverageReporters: [
		"json",
		"lcov",
		"text",
		"clover",
		"text-summary",
	],
	testEnvironment: "jsdom",
	testEnvironmentOptions: {
		url: "http://localhost",
	},
};

module.exports = config;
