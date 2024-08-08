module.exports = {
	moduleFileExtensions: [
		"js",
	],
	transform: {
		"^.+\\.jsx?$": "babel-jest",
		"^.+\\.html$": "jest-html-loader",
	},
	transformIgnorePatterns: [
		"<rootDir>/node_modules/(?!lodash-es/.*)",
	],
	testMatch: [
		"**/spec/**/*.js",
	],
	testEnvironment: "jsdom",
	moduleDirectories: [
		"node_modules",
	],
	moduleNameMapper: {
		"^lodash-es$": "lodash",
		"^lodash-es/(.*)$": "lodash/$1",
		// Without the next line, `import ... from "yoastseo"` statements would load from the build directory. In the
		// tests we always want to test the source.
		"^yoastseo$": "<rootDir>/src/index.js",
	},
	testPathIgnorePatterns: [
		"<rootDir>/node_modules/",
		// Removes the spec/test helpers.
		"<rootDir>/spec/specHelpers/*",
		"<rootDir>/spec/scoring/assessments/inclusiveLanguage/testHelpers",
		// Removes the index.js in the testTexts folder.
		"<rootDir>/spec/fullTextTests/testTexts",
		"<rootDir>/spec/scoring/assessors/collectionPages/fullTextTests/testTexts",
		"<rootDir>/spec/scoring/assessors/productPages/fullTextTests/testTexts",
		// Removes the generateStems.js in the languages folders.
		"<rootDir>/spec/languageProcessing/languages/[a-z][a-z]/helpers/internal/stemmerCoverage/generateStems.js",
	],

	collectCoverage: true,
	// We need to make this a bit more specific -- e.g. don't include some language-specific config files.
	collectCoverageFrom: [
		"**/src/**/*.js",
		"!**/src/**/index.js",
	],
	coverageReporters: [
		"json",
		"lcov",
		"text",
		"clover",
		"text-summary",
	],
	coverageThreshold: {
		global: {
			branches: 74,
			functions: 78,
			lines: 83,
			statements: 83,
		},
	},
};
