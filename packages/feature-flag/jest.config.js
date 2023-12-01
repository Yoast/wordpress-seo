/** @type {import('jest').Config} */
const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	testURL: "http://localhost",
	transformIgnorePatterns: [
		"/node_modules/(?!yoastseo|lodash-es).+\\.js$",
	],
	setupTestFrameworkScriptFile: "<rootDir>/tools/jest/setupTests.js",
};

module.exports = config;
