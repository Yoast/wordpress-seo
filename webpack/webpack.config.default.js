const _defaultsDeep = require( "lodash/defaultsDeep" );
const webpack = require( "webpack" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );
const path = require( "path" );

const paths = require( "./paths" );
const pkg = require( "../package.json" );

const pluginVersionSlug = paths.flattenVersionForFile( pkg.yoast.pluginVersion );
const outputFilename = "[name]-" + pluginVersionSlug + ".min.js";

const externals = {
	// This is necessary for Gutenberg to work.
	tinymce: "window.tinymce",
};

// This makes sure the @wordpress dependencies are correctly transformed.
const wpDependencies = [
	"i18n",
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
};

wpDependencies.forEach( wpDependency => {
	alias[ "@wordpress/" + wpDependency ] = path.join(
		__dirname,
		"../",
		"node_modules/gutenberg/" + wpDependency
	);
} );


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
				test: /\.json$/,
				use: [ "json-loader" ],
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
