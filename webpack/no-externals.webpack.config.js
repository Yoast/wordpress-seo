const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );

const baseConfig = require( "./baseConfig" );

module.exports = function( env = { environment: "production" } ) {
	return {
		...baseConfig( env ),
		mode: env.environment,
		entry: {
			"wp-seo-analysis-worker": "./js/src/wp-seo-analysis-worker.js",
			"babel-polyfill": "./js/src/babel-polyfill.js",
		},
		plugins: [
			new CaseSensitivePathsPlugin(),
		],
		optimization: {
			runtimeChunk: false,
		},
	};
};
