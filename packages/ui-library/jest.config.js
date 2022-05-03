const path = require( "path" );

module.exports = {
	preset: "@yoast/jest-preset",
	// Transform: {
	// 	"^.+\\.[tj]sx?$": "babel-jest",
	// },
	moduleNameMapper: {
		"\\.(scss|css)$": require.resolve(
			"@wordpress/jest-preset-default/scripts/style-mock.js",
		),
		// Mock and ignore MDX files, we only use them for docs.
		"\\.mdx$": path.resolve( __dirname, "tests/mocks/mdx.js" ),
	},
};
