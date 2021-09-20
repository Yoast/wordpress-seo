const defaultConfig = require( "@wordpress/scripts/config/webpack.config" );
const { find, isEqual } = require( "lodash" );

// Find the js and jsx loader.
const jsxLoader = find( defaultConfig.module.rules, { test: /\.jsx?$/ } );
// Remove js and jsx loader from rules.
const rulesWithoutJsxLoader = defaultConfig.module.rules.filter( ( { test } ) => ! isEqual( test, /\.jsx?$/ ) );

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [
			...rulesWithoutJsxLoader,
			// Re-add js and jsx loader to rules with custom exclude prop.
			{
				...jsxLoader,
				// Include all @yoast packages in js and jsx loaders loaders.
				exclude: {
					test: /node_modules/,
					exclude: /node_modules[/\\]@yoast/,
				},
			},
		],
	},
};
