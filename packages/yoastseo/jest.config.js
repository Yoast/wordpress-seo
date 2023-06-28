module.exports = {
	preset: "@yoast/jest-preset",

	testMatch: [
		"**/spec/**/*.js",
	],
	testPathIgnorePatterns: [
		"<rootDir>/node_modules/",
		// Removes the spec/test helpers.
		"<rootDir>/spec/specHelpers/*",
		"<rootDir>/spec/scoring/assessments/inclusiveLanguage/testHelpers",
		// Removes the index.js in the testTexts folder.
		"<rootDir>/spec/fullTextTests/testTexts",
		"<rootDir>/spec/scoring/collectionPages/fullTextTests/testTexts",
		"<rootDir>/spec/scoring/productPages/fullTextTests/testTexts",
		// Removes the generateStems.js in the languages folders.
		"<rootDir>/spec/languageProcessing/languages/[a-z][a-z]/helpers/internal/stemmerCoverage/generateStems.js",
	],

	transform: {
		"^.+\\.jsx?$": "babel-jest",
		"^.+\\.html$": "<rootDir>/spec/specHelpers/rawLoader",
	},
	transformIgnorePatterns: [
		"<rootDir>/node_modules/(?!lodash-es/.*)",
	],

	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 74,
			functions: 78,
			lines: 83,
			statements: 83,
		},
	},

	moduleNameMapper: {
		"^lodash-es$": "lodash",
		"^lodash-es/(.*)$": "lodash/$1",
	},
};
