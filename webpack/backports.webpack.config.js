import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";

const externals = require( "./externals" );
const paths     = require( "./paths" );
const utils     = require( "./utils" );

module.exports = function( env = { environment: "production", recalibration: "disabled" } ) {
	const outputFilename = utils.getOutputFilename( env.environment );

	return {
		resolve: {
			extensions: [".json", ".js", ".jsx"],
			symlinks: false,
		},
		externals: {
			...externals,

			"@wordpress/element": "window.wp.element",
			"@wordpress/data": "window.wp.data",
			"@wordpress/components": "window.wp.components",
			"@wordpress/i18n": "window.wp.i18n",
			"@wordpress/api-fetch": "window.wp.apiFetch",
			"@wordpress/rich-text": "window.wp.richText",
			"@wordpress/compose": "window.wp.compose",
		},
		output: {
			path: paths.jsDist,
			filename: "wp-" + outputFilename,
			jsonpFunction: "yoastWebpackJsonp",
			library: ["wp", "[name]"],
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
	};
};
