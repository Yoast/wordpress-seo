const path = require( "path" );

module.exports = {
	preset: "@yoast/jest-preset",
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
