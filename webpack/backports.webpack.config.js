const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );

const paths     = require( "./paths" );
const utils     = require( "./utils" );
const baseConfig = require( "./baseConfig" );

module.exports = function( env = { environment: "production", recalibration: "disabled" } ) {
	const outputFilename = utils.getOutputFilename( env.environment );

	return {
		...baseConfig( env.environment ),
		mode: env.environment,
		resolve: {
			extensions: [ ".json", ".js", ".jsx" ],
			symlinks: false,
		},
		externals: {
			tinymce: "tinymce",
			react: "React",
			"react-dom": "ReactDOM",
			lodash: "lodash",

			"@wordpress/element": [ "wp", "element" ],
			"@wordpress/data": [ "wp", "data" ],
			"@wordpress/components": [ "wp",  "components" ],
			"@wordpress/i18n": [ "wp", "i18n" ],
			"@wordpress/api-fetch": [ "wp", "apiFetch" ],
			"@wordpress/rich-text": [ "wp", "richText" ],
			"@wordpress/compose": [ "wp", "compose" ],
		},
		output: {
			path: paths.jsDist,
			filename: "wp-" + outputFilename,
			jsonpFunction: "yoastWebpackJsonp",
			library: {
				root: [ "wp", "[name]" ],
			},
			libraryTarget: "this",
		},
		entry: {
			apiFetch: "./node_modules/@wordpress/api-fetch",
			components: "./node_modules/@wordpress/components",
			data: "./node_modules/@wordpress/data",
			element: "./node_modules/@wordpress/element",
			i18n: "./node_modules/@wordpress/i18n",
			compose: "./node_modules/@wordpress/compose",
			richText: "./node_modules/@wordpress/rich-text",
		},
		plugins: [
			new CaseSensitivePathsPlugin(),
		],
		optimization: {
			runtimeChunk: false,
		},
	};
};
