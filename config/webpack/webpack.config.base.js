const DependencyExtractionWebpackPlugin = require( "@wordpress/dependency-extraction-webpack-plugin" );
const defaultConfig = require( "@wordpress/scripts/config/webpack.config" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const { BundleAnalyzerPlugin } = require( "webpack-bundle-analyzer" );
const { yoastExternals } = require( "./externals" );

let analyzerPort = 8888;

module.exports = function( { entry, output, combinedOutputFile, cssExtractFileName, plugins = [] } ) {
	return {
		...defaultConfig,
		optimization: {
			...defaultConfig.optimization,
			usedExports: process.env.NODE_ENV === "production",
		},
		entry,
		output: {
			...defaultConfig.output,
			...output,
		},
		plugins: [
			...defaultConfig.plugins.filter(
				( plugin ) =>
					plugin.constructor.name !== "DependencyExtractionWebpackPlugin" &&
					plugin.constructor.name !== "MiniCssExtractPlugin" &&
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
						return [ "lodash", request.substring( 7 ) ];
					}
					if ( request.startsWith( "lodash-es/" ) ) {
						return [ "lodash", request.substring( 10 ) ];
					}
					if ( request.startsWith( "@yoast/externals/" ) ) {
						return [ "yoast", "externals", request.substring( 17 ) ];
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
					if ( request.startsWith( "@yoast/externals/" ) ) {
						return "yoast-seo-externals-" + request.substring( 17 );
					}
				},
			} ),
			new MiniCssExtractPlugin( { filename: cssExtractFileName } ),
			process.env.WP_BUNDLE_ANALYZER && new BundleAnalyzerPlugin( {
				analyzerPort: analyzerPort++,
			} ),
			...plugins,
		].filter( Boolean ),
	};
};
