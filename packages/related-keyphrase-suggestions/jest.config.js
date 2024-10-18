const path = require( "path" );

module.exports = {
	preset: "@yoast/jest-preset",
	moduleNameMapper: {
		"\\.(scss|css)$": require.resolve(
			"@wordpress/jest-preset-default/scripts/style-mock.js",
		),
		"^lodash-es$": "lodash",
		"^lodash-es/(.*)$": "lodash/$1",
		// Mock and ignore MD and MDX files, we only use them for docs.
		"\\.mdx?$": path.resolve( __dirname, "tests/mocks/mdx.js" ),
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
};
