module.exports = {
	preset: "@yoast/jest-preset",
	setupFilesAfterEnv: [ "<rootDir>/tools/jest/setupTests.js" ],
	testMatch: [
		"**/tests/**/*Test.[jt]s",
	],
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
