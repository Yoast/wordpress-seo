/** @type {import('jest').Config} */

const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	testPathIgnorePatterns: [
		"/tests/setupTests.js",
	],
	testEnvironmentOptions: {
		url: "http://localhost",
	},
	setupFilesAfterEnv: [ "<rootDir>/jest/setupTests.js" ],
	moduleNameMapper: {
		"\\.css$": "<rootDir>/jest/__mocks__/styleMock.js",
		// The `@wordpress/i18n` package is using this module.
		// It defaults to an ESM import in Jest for some reason.
		// This is a workaround to point it to the CommonJS version.
		memize: "<rootDir>/../../node_modules/memize/dist/index.cjs",
		"@yoast/ui-library": "<rootDir>/../ui-library/src",
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
	testEnvironment: "jest-environment-jsdom",
	transform: {
		"^.+\\.[jt]sx?$": "babel-jest",
	},
};

module.exports = config;
