/** @type {import('jest').Config} */
const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	testURL: "http://localhost",
	transformIgnorePatterns: [
		"/node_modules/(?!yoastseo|lodash-es).+\\.js$",
	],
	setupTestFrameworkScriptFile: "<rootDir>/jest/setupTests.js",
	moduleNameMapper: {
		"\\.css$": "<rootDir>/jest/CSSStub.js",
		"^lodash-es$": "lodash",
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
