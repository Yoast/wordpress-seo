/** @type {import('jest').Config} */
const config = {
	testMatch: [
		"**/*Test.[jt]s",
	],
	testURL: "http://localhost",
	setupFilesAfterEnv: [ "<rootDir>/tests/setupTests.js" ],
	moduleNameMapper: {
		"^lodash-es$": "lodash",
		"^lodash-es/(.*)$": "lodash/$1",
		"\\.css$": "<rootDir>/tests/CSSStub.js",
		// The `@wordpress/i18n` package is using this module.
		// It defaults to an ESM import in Jest for some reason.
		// This is a workaround to point it to the CommonJS version.
		memize: "<rootDir>/../../node_modules/memize/dist/index.cjs",
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
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.[jt]sx?$": "babel-jest",
	},
	transformIgnorePatterns: [
		"/node_modules/(?!@yoast/ui-library|@yoast/social-metadata-forms|@yoast/components|parse5)",
	],
};

module.exports = config;
