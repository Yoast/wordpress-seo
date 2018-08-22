const webpack = require( "webpack" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );
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

// This makes sure the @wordpress dependencies are correctly transformed.
const wpDependencies = [
	"blocks",
	"utils",
	"date",
	"editor",
	"viewport",
];

const alias = {
	// This prevents loading multiple versions of React:
	react: path.join( root, "node_modules/react" ),
	"react-dom": path.join( root, "node_modules/react-dom" ),

	// This prevents loading multiple versions of @wordpress/i18n:
	"@wordpress/i18n": path.join( root, "node_modules/@wordpress/i18n" ),
};

wpDependencies.forEach( wpDependency => {
	alias[ "@wordpress/" + wpDependency ] = path.join(
		__dirname,
		"../",
		"node_modules/gutenberg/" + wpDependency
	);
} );

module.exports = function( env = { environment: "production" } ) {
	const mode = env.environment;

	const plugins = [
		new webpack.DefinePlugin( {
			"process.env": {
				NODE_ENV: JSON.stringify( mode ),
			},
		} ),
		new UnminifiedWebpackPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
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
					exclude: /node_modules\/(?!(yoast-components|gutenberg|yoastseo|@wordpress)\/).*/,
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

	const config = [
		{
			...base,
			externals: {
				...externals,

				"@wordpress/element": "window.yoast._wp.element",
				"@wordpress/data": "window.yoast._wp.data",
				"@wordpress/components": "window.yoast._wp.components",
				"@wordpress/i18n": "window.yoast._wp.i18n",

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

	if ( mode === "development" ) {
		config[ 0 ].devServer = {
			publicPath: "/",
		};
	}

	return config;
};
