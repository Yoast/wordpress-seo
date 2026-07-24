const path = require( "path" );

module.exports = {
	preset: "@yoast/jest-preset",
	// The preset's testMatch globs `tests/**`, so exclude helper files and the disabled
	// storyshots suite (which imports uninstalled packages) from being picked up as tests.
	testPathIgnorePatterns: [
		"<rootDir>/node_modules/",
		"<rootDir>/vendor/",
		"<rootDir>/tests/storyshots.js",
		"<rootDir>/tests/setup.js",
		"<rootDir>/tests/mocks/",
	],
	// Polyfill browser APIs that jsdom lacks but Headless UI relies on.
	setupFilesAfterEnv: [ path.resolve( __dirname, "tests/setup.js" ) ],
	moduleNameMapper: {
		"\\.(scss|css)$": require.resolve(
			"@wordpress/jest-preset-default/scripts/style-mock.js",
		),
		// Mock and ignore MD and MDX files, we only use them for docs.
		"\\.mdx?$": path.resolve( __dirname, "tests/mocks/mdx.js" ),
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
};
