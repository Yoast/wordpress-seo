const _defaultsDeep = require( "lodash/defaultsDeep" );
const webpack = require( "webpack" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );
const path = require( "path" );

const paths = require( "./paths" );
const pkg = require( "../package.json" );

const pluginVersionSlug = paths.flattenVersionForFile( pkg.yoast.pluginVersion );
const outputFilename = "[name]-" + pluginVersionSlug + ".min.js";

const wpDependencies = [
	"element",
	"data",
];
const externals = {};
wpDependencies.forEach( wpDependency => {
	externals[ "@wordpress/" + wpDependency ] = path.resolve(
		__dirname,
		"node_modules/gutenberg/" + wpDependency,
	);
} );

const defaultWebpackConfig = {
	devtool: "eval",
	entry: paths.entry,
	context: paths.jsSrc,
	output: {
		path: paths.jsDist,
		filename: outputFilename,
		jsonpFunction: "yoastWebpackJsonp",
	},
	externals,
	resolve: {
		extensions: [ ".js", ".jsx" ],
	},
	module: {
		rules: [
			{
				test: /.js$/,
				include: wpDependencies
					.map( dependency => path.resolve( __dirname, "node_modules/gutenberg", dependency ) )
					.concat( [ path.resolve( __dirname, "src" ) ] ),
				use: "babel-loader",
			},
			{
				test: /.jsx?$/,
				use: [
					{
						loader: "babel-loader",
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
