const _defaultsDeep = require( "lodash/defaultsDeep" );
const webpack = require( "webpack" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );

const paths = require( "./paths" );
const outputFilename = "[name]-<%= pluginVersionSlug %>.min.js";

const defaultWebpackConfig = {
	devtool: "eval",
	entry: paths.entry,
	context: paths.jsSrc,
	output: {
		path: paths.jsDist,
		filename: outputFilename,
	},
	resolve: {
		extensions: [ ".js", ".jsx" ],
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				use: [
					{
						loader: "babel-loader",
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
		new webpack.optimize.UglifyJsPlugin(),
		new UnminifiedWebpackPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
	],
};

const defaults = ( config ) => {
	return _defaultsDeep( defaultWebpackConfig, config );
};

module.exports = {
	defaults,
};
