/** @type {import('jest').Config} */
const config = {
	testEnvironment: "node",
	testMatch: [
		"**/*Test.[jt]s",
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

module.exports = config;
