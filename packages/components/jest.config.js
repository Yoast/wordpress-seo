/** @type {import('jest').Config} */
const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	testURL: "http://localhost",
	setupFilesAfterEnv: [ "<rootDir>/jest/setupTests.js" ],
	moduleNameMapper: {
		"\\.css$": "<rootDir>/jest/CSSStub.js",
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
};

module.exports = config;
