/* global require, module */
const webpack = require( "webpack" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );

const paths = require( "./paths" );

const pluginVersion = "5.0.2";

const versionParts = pluginVersion.split( "." );
if ( versionParts.length === 2 ) {
	versionParts.push( 0 );
}

const pluginVersionSlug = versionParts.join( "" );

const PLUGINS = [
	new webpack.DefinePlugin( {
		"process.env": {
			NODE_ENV: JSON.stringify( "production" ),
		},
	} ),
	new webpack.optimize.UglifyJsPlugin(),
	new UnminifiedWebpackPlugin(),
	new webpack.optimize.AggressiveMergingPlugin(),
];

let outputFilename = `[name]-${pluginVersionSlug}.min.js`;

module.exports = {
	devtool: "cheap-module-source-map",
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
	plugins: PLUGINS,
};


