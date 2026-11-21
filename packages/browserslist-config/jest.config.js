/** @type {import('jest').Config} */
const config = {
	testEnvironment: "node",
	testMatch: [
		"**/*Test.[jt]s",
	],
	collectCoverageFrom: [
		"index.js",
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
