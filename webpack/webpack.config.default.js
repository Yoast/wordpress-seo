const _defaultsDeep = require( "lodash/defaultsDeep" );
const webpack = require( "webpack" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );
const path = require( "path" );

const paths = require( "./paths" );
const pkg = require( "../package.json" );

const pluginVersionSlug = paths.flattenVersionForFile( pkg.yoast.pluginVersion );
const outputFilename = "[name]-" + pluginVersionSlug + ".min.js";
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );
const postCSSPlugin = require( "./dependencies/post-css-config" );

const externals = {
	// This is necessary for Gutenberg to work.
	tinymce: "window.tinymce",
	yoastseo: "window.yoast.analysis",
};

// This makes sure the @wordpress dependencies are correctly transformed.
const wpDependencies = [
	"components",
	"element",
	"blocks",
	"utils",
	"date",
	"data",
	"editor",
	"viewport",
];

const alias = {
	// This prevents loading multiple versions of React:
	react: path.join( __dirname, "../", "node_modules/react" ),
	"react-dom": path.join( __dirname, "../", "node_modules/react-dom" ),

	// This prevents loading multiple versions of @wordpress/i18n:
	"@wordpress/i18n": path.join( __dirname, "../", "node_modules/@wordpress/i18n" ),
};

wpDependencies.forEach( wpDependency => {
	alias[ "@wordpress/" + wpDependency ] = path.join(
		__dirname,
		"../",
		"node_modules/gutenberg/" + wpDependency
	);
} );

// CSS loader for styles specific to blocks in general.
const blocksCSSPlugin = new ExtractTextPlugin( {
	filename: "./build/core-blocks/style.css",
} );

// Main CSS loader for everything but blocks..
const mainCSSExtractTextPlugin = new ExtractTextPlugin( {
	filename: './build/[basename]/style.css',
} );

// CSS loader for styles specific to block editing.
const editBlocksCSSPlugin = new ExtractTextPlugin( {
	filename: './build/core-blocks/edit-blocks.css',
} );

// CSS loader for default visual block styles.
const themeBlocksCSSPlugin = new ExtractTextPlugin( {
	filename: './build/core-blocks/theme.css',
} );

// Configuration for the ExtractTextPlugin.
const extractConfig = {
	use: [
		{ loader: "raw-loader" },
		{
			loader: "postcss-loader",
			options: {
				plugins: postCSSPlugin,
			},
		},
		{
			loader: "sass-loader",
			query: {
				includePaths: [ "edit-post/assets/stylesheets" ],
				data: '@import "colors"; @import "breakpoints"; @import "variables"; @import "mixins"; @import "animations";@import "z-index";',
				outputStyle: "production" === process.env.NODE_ENV
					? "compressed" : "nested",
			},
		},
	],
};

const defaultWebpackConfig = {
	devtool: "cheap-module-eval-source-map",
	entry: paths.entry,
	context: paths.jsSrc,
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
				exclude: /node_modules\/(?!(yoast-components|gutenberg|yoastseo)\/).*/,
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
			{
				test: /style\.s?css$/,
				include: [
					/core-blocks/,
				],
				use: blocksCSSPlugin.extract( extractConfig ),
			},
			{
				test: /editor\.s?css$/,
				include: [
					/core-blocks/,
				],
				use: editBlocksCSSPlugin.extract( extractConfig ),
			},
			{
				test: /theme\.s?css$/,
				include: [
					/core-blocks/,
				],
				use: themeBlocksCSSPlugin.extract( extractConfig ),
			},
			{
				test: /\.s?css$/,
				exclude: [
					/core-blocks/,
				],
				use: mainCSSExtractTextPlugin.extract( extractConfig ),
			},
			{
				test: /\.json$/,
				use: [ "json-loader" ],
			},
			{
				test: /\.scss$/,
				include: [
					/node_modules\/gutenberg/,
				],
				use: blocksCSSPlugin.extract( extractConfig ),
			},
		],
	},
	externals,
	plugins: [
		new webpack.DefinePlugin( {
			"process.env": {
				NODE_ENV: JSON.stringify( "production" ),
			},
		} ),
		blocksCSSPlugin,
		new UnminifiedWebpackPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.CommonsChunkPlugin( {
			name: "vendor",
			filename: "commons-" + pluginVersionSlug + ".min.js",
		} ),
	],
};

const defaults = ( config ) => {
	return _defaultsDeep( config, defaultWebpackConfig );
};

module.exports = {
	defaults,
};
