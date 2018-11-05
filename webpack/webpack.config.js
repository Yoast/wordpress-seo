const webpack = require( "webpack" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );
const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );
const path = require( "path" );
const mapValues = require( "lodash/mapValues" );
const isString = require( "lodash/isString" );

const paths = require( "./paths" );
const pkg = require( "../package.json" );

const pluginVersionSlug = paths.flattenVersionForFile( pkg.yoast.pluginVersion );
const outputFilename = "[name]-" + pluginVersionSlug + ".min.js";

const root = path.join( __dirname, "../" );
const entry = mapValues( paths.entry, entry => {
	if ( ! isString( entry ) ) {
		return entry;
	}

	return "./" + path.join( "js/src/", entry );
} );

const externals = {
	// This is necessary for Gutenberg to work.
	tinymce: "window.tinymce",

	yoastseo: "window.yoast.analysis",
	"yoast-components": "window.yoast.components",

	lodash: "window.lodash",
};

const alias = {
	// This prevents loading multiple versions of React:
	react: path.join( root, "node_modules/react" ),
	"react-dom": path.join( root, "node_modules/react-dom" ),
};

module.exports = function( env = { environment: "production" } ) {
	const mode = env.environment;
	const isRecalibration = process.env.YOAST_RECALIBRATION === "enabled";

	const plugins = [
		new webpack.DefinePlugin( {
			"process.env": {
				NODE_ENV: JSON.stringify( mode ),
				YOAST_RECALIBRATION: JSON.stringify( isRecalibration ? "enabled" : "disabled" ),
			},
		} ),
		new UnminifiedWebpackPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new CaseSensitivePathsPlugin(),
	];

	const base = {
		devtool: mode === "development" ? "cheap-module-eval-source-map" : false,
		entry: entry,
		context: root,
		output: {
			path: paths.jsDist,
			filename: outputFilename,
			jsonpFunction: "yoastWebpackJsonp",
		},
		resolve: {
			extensions: [ ".json", ".js", ".jsx" ],
			alias,
			symlinks: false,
		},
		module: {
			rules: [
				{
					test: /.jsx?$/,
					exclude: /node_modules[/\\](?!(yoast-components|gutenberg|yoastseo|@wordpress)[/\\]).*/,
					use: [
						{
							loader: "babel-loader",
							options: {
								env: {
									development: {
										plugins: [
											"babel-plugin-styled-components",
										],
									},
								},
							},
						},
					],
				},
				{
					test: /.svg$/,
					use: [
						{
							loader: "svg-react-loader",
						},
					],
				},
			],
		},
		externals,
	};

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
				externals: {
					...externals,

					"@wordpress/element": "window.yoast._wp.element",
					"@wordpress/data": "window.yoast._wp.data",
					"@wordpress/components": "window.yoast._wp.components",
					"@wordpress/i18n": "window.yoast._wp.i18n",
					"@wordpress/api-fetch": "window.yoast._wp.apiFetch",

					"styled-components": "window.yoast.styledComponents",
				},
				plugins: [
					...plugins,
					new webpack.optimize.CommonsChunkPlugin( {
						name: "vendor",
						filename: "commons-" + pluginVersionSlug + ".min.js",
					} ),
				],
			},
			// Config for files that should not use any externals at all.
			{
				...base,
				entry: {
					"wp-seo-wp-globals-backport": "./js/src/wp-seo-wp-globals-backport.js",
					"wp-seo-analysis-worker": "./js/src/wp-seo-analysis-worker.js",
					"babel-polyfill": "./js/src/babel-polyfill.js",
				},
				plugins,
			},
			// Config for files that should only use externals available in the web worker context.
			{
				...base,
				externals: { yoastseo: "yoast.analysis" },
				entry: {
					"wp-seo-used-keywords-assessment": "./js/src/wp-seo-used-keywords-assessment.js",
				},
				plugins,
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
