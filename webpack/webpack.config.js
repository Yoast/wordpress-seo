const webpack = require( "webpack" );
const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );
const path = require( "path" );
const mapValues = require( "lodash/mapValues" );
const isString = require( "lodash/isString" );

const paths = require( "./paths" );
const externals = require( "./externals" );

const noExternalsConfig = require( "./no-externals.webpack.config" );
const backportsConfig = require( "./backports.webpack.config" );
const baseConfig = require( "./baseConfig" );

const mainEntry = mapValues( paths.entry, entry => {
	if ( ! isString( entry ) ) {
		return entry;
	}

	return "./" + path.join( "js/src/", entry );
} );

module.exports = function( env = { environment: "production", recalibration: "disabled" } ) {
	const mode = env.environment;
	const isRecalibration = ( env.recalibration || process.env.YOAST_RECALIBRATION || "disabled" ) === "enabled";

	const plugins = [
		new webpack.DefinePlugin( {
			"process.env": {
				YOAST_RECALIBRATION: JSON.stringify( isRecalibration ? "enabled" : "disabled" ),
			},
		} ),
		new CaseSensitivePathsPlugin(),
	];

	const base = baseConfig( mode );

	let config;

	/*
	 * When using recalibration in the production build:
	 *
	 * The only output should be files that use the analysis:
	 * - Analysis Worker
	 * - Analysis
	 */
	if ( isRecalibration && mode === "production" ) {
		config = [
			// Analysis web worker.
			{
				...base,
				entry: {
					"wp-seo-analysis-worker": "./js/src/wp-seo-analysis-worker.js",
				},
				plugins,
			},
			// Analysis that is used as external (`window.yoastseo`).
			{
				...base,
				entry: {
					analysis: "./js/src/analysis.js",
				},
				plugins,
			},
		];
	} else {
		config = [
			{
				...base,
				entry: {
					...mainEntry,
					"styled-components": "./js/src/styled-components.js",
					analysis: "./js/src/analysis.js",
					components: "./js/src/components.js",
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

					"styled-components": "window.yoast.styledComponents",
				},
				plugins: [
					...plugins,
					new CopyWebpackPlugin( [
						{
							from: "node_modules/react/umd/react.production.min.js",
							// Relative to js/dist.
							to: "../vendor/react.min.js",
						},
						{
							from: "node_modules/react-dom/umd/react-dom.production.min.js",
							// Relative to js/dist.
							to: "../vendor/react-dom.min.js",
						},
					] ),
				],
			},
			// Config for wp packages files that are shipped for BC with WP 4.9.
			backportsConfig( env ),
			// Config for files that should not use any externals at all.
			noExternalsConfig( env ),
			// Config for files that should only use externals available in the web worker context.
			{
				...base,
				externals: { yoastseo: "yoast.analysis" },
				entry: {
					"wp-seo-used-keywords-assessment": "./js/src/wp-seo-used-keywords-assessment.js",
				},
				plugins,
				optimization: {
					runtimeChunk: false,
				},
			},
		];
	}

	if ( mode === "development" ) {
		config[ 0 ].devServer = {
			publicPath: "/",
		};
	}

	return config;
};
