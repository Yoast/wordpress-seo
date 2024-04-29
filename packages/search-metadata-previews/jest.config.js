/** @type {import('jest').Config} */
const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	setupFilesAfterEnv: [ "<rootDir>/tests/setupTests.js" ],
	moduleNameMapper: {
		"\\.css$": "<rootDir>/tests/CSSStub.js",
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
