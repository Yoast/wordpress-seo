// External dependencies
const DependencyExtractionWebpackPlugin = require( "@wordpress/dependency-extraction-webpack-plugin" );
const defaultConfig = require( "@wordpress/scripts/config/webpack.config" );
const MiniCSSExtractPlugin = require( "mini-css-extract-plugin" );
const { BundleAnalyzerPlugin } = require( "webpack-bundle-analyzer" );

// Internal dependencies
const { yoastExternals } = require( "./externals" );

let analyzerPort = 8888;

module.exports = function( { entry, output, combinedOutputFile, cssExtractFileName } ) {
	const exclude = /node_modules[/\\](?!(yoast-components|gutenberg|yoastseo|@wordpress|@yoast|parse5)[/\\]).*/;
	// The index of the babel-loader rule.
	let ruleIndex = 0;
	if ( process.env.NODE_ENV !== "production" ) {
		ruleIndex = 1;
		defaultConfig.module.rules[ 0 ].exclude = [ exclude ];
	}
	defaultConfig.module.rules[ ruleIndex ].exclude = exclude;

	return {
		...defaultConfig,
		devtool: process.env.environment === "development" ? "cheap-module-eval-source-map" : false,
		entry,
		output: {
			...defaultConfig.output,
			...output,
		},
		plugins: [
			...defaultConfig.plugins.filter(
				( plugin ) =>
					plugin.constructor.name !== "DependencyExtractionWebpackPlugin" &&
					plugin.constructor.name !== "MiniCSSExtractPlugin" &&
					plugin.constructor.name !== "CleanWebpackPlugin" &&
					plugin.constructor.name !== "BundleAnalyzerPlugin"
			),
			new DependencyExtractionWebpackPlugin( {
				injectPolyfill: true,
				combineAssets: true,
				combinedOutputFile,
				/**
				 * Handles requests to externals.
				 *
				 * @param {string} request The requested package.
				 *
				 * @returns {string|null} The external.
				 */
				requestToExternal( request ) {
					if ( yoastExternals[ request ] ) {
						return [ "yoast", yoastExternals[ request ] ];
					}
					if ( request.startsWith( "lodash/" ) ) {
						return [ "lodash", request.substr( 7 ) ];
					}
					if ( request.startsWith( "lodash-es/" ) ) {
						return [ "lodash", request.substr( 10 ) ];
					}
					if ( request === "react-select" ) {
						return [ "yoast", "reactSelect" ];
					}
					if ( request === "react-select/async" ) {
						return [ "yoast", "reactSelectAsync" ];
					}
					if ( request.startsWith( "@yoast/externals/" ) ) {
						return [ "yoast", "externals", request.substr( 17 ) ];
					}
				},
				/**
				 * Handles requests to externals.
				 *
				 * @param {string} request The requested package.
				 *
				 * @returns {string|null} The external.
				 */
				requestToHandle( request ) {
					if ( yoastExternals[ request ] ) {
						const handle = yoastExternals[ request ].replace( /([A-Z])/g, "-$1" ).toLowerCase();
						return "yoast-seo-" + handle + "-package";
					}
					if ( request.startsWith( "lodash/" ) || request.startsWith( "lodash-es/" ) ) {
						return "lodash";
					}
					if ( request === "react-select" || request === "react-select/async" ) {
						return "yoast-seo-react-select";
					}
					if ( request.startsWith( "@yoast/externals/" ) ) {
						return "yoast-seo-externals-" + request.substr( 17 );
					}
				},
			} ),
			new MiniCSSExtractPlugin( { filename: cssExtractFileName } ),
			process.env.WP_BUNDLE_ANALYZER && new BundleAnalyzerPlugin( {
				analyzerPort: analyzerPort++,
			} ),
		].filter( Boolean ),
	};
};
