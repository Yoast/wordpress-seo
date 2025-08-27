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
	moduleNameMapper: {
		// The `@wordpress/i18n` package is using this module.
		// It defaults to an ESM import in Jest for some reason.
		// This is a workaround to point it to the CommonJS version.
		memize: "<rootDir>/../../node_modules/memize/dist/index.cjs",
	},
};
