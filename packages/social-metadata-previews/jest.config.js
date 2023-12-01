/** @type {import('jest').Config} */
const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	testURL: "http://localhost",
	setupTestFrameworkScriptFile: "<rootDir>/jest/setupTests.js",
	moduleNameMapper: {
		"^lodash-es$": "lodash",
		"^lodash-es/(.*)$": "lodash/$1",
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
};

module.exports = config;
