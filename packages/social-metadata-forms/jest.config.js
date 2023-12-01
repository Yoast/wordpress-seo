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
};

module.exports = config;
