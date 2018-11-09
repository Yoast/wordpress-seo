const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const path = require( "path" );
const mapValues = require( "lodash/mapValues" );
const isString = require( "lodash/isString" );

const paths = require( "./paths" );
const pkg = require( "../package.json" );

const pluginVersionSlug = paths.flattenVersionForFile( pkg.yoast.pluginVersion );

const root = path.join( __dirname, "../" );
const mainEntry = mapValues( paths.entry, entry => {
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
	react: "React",
	"react-dom": "ReactDOM",

	lodash: "window.lodash",
};

module.exports = function( env = { environment: "production" } ) {
	const mode = env.environment;
	const outputFilenamePostfix = mode === "development" ? ".js" : ".min.js";
	const outputFilename = "[name]-" + pluginVersionSlug + outputFilenamePostfix;

	const plugins = [
		new CaseSensitivePathsPlugin(),
	];

	const base = {
		mode: mode,
		devtool: mode === "development" ? "cheap-module-eval-source-map" : false,
		context: root,
		output: {
			path: paths.jsDist,
			filename: outputFilename,
			jsonpFunction: "yoastWebpackJsonp",
		},
		resolve: {
			extensions: [ ".json", ".js", ".jsx" ],
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
		optimization: {
			runtimeChunk: {
				name: "commons",
			},
		},
	};

	const config = [
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
		{
			...base,
			externals: {
				...externals,

				"@wordpress/element": "window.wp.element",
				"@wordpress/data": "window.wp.data",
				"@wordpress/components": "window.wp.components",
				"@wordpress/i18n": "window.wp.i18n",
				"@wordpress/api-fetch": "window.wp.apiFetch",
			},
			output: {
				path: paths.jsDist,
				filename: "wp-" + outputFilename,
				jsonpFunction: "yoastWebpackJsonp",
				library: [ "wp", "[name]" ],
			},
			entry: {
				apiFetch: "./node_modules/@wordpress/api-fetch",
				components: "./node_modules/@wordpress/components",
				data: "./node_modules/@wordpress/data",
				element: "./node_modules/@wordpress/element",
				i18n: "./node_modules/@wordpress/i18n",
			},
			plugins,
		},
		// Config for files that should not use any externals at all.
		{
			...base,
			entry: {
				"wp-seo-analysis-worker": "./js/src/wp-seo-analysis-worker.js",
				"babel-polyfill": "./js/src/babel-polyfill.js",
			},
			plugins,
			optimization: {
				runtimeChunk: false,
			},
		},
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

	if ( mode === "development" ) {
		config[ 0 ].devServer = {
			publicPath: "/",
		};
	}

	return config;
};
