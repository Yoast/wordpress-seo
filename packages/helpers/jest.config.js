/** @type {import('jest').Config} */
const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	setupFilesAfterEnv: [ "<rootDir>/tools/jest/setupTests.js" ],
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
	moduleNameMapper: {
		// The `@wordpress/i18n` package is using this module.
		// It defaults to an ESM import in Jest for some reason.
		// This is a workaround to point it to the CommonJS version.
		memize: "<rootDir>/../../node_modules/memize/dist/index.cjs",
	},
};

module.exports = config;
