/** @type {import('jest').Config} */
const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	testURL: "http://localhost",
	setupTestFrameworkScriptFile: "<rootDir>/tools/jest/setupTests.js",
	moduleNameMapper: {
		"^lodash-es$": "lodash",
	},
};

module.exports = config;
