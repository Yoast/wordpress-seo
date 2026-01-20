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
		// The `yoastseo` package is using this module.
		// Parse5 v8.0.0 switched to being an ES module-only package.
		// This is a workaround to point it to the CommonJS version.
		parse5: "<rootDir>/../../node_modules/parse5/lib/index.js",
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
		"/node_modules/(?!@yoast/ui-library|@yoast/social-metadata-forms|@yoast/components)",
	],
};

module.exports = config;
