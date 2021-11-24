const path = require( "path" );

const externals = require( "./externals/externals" );
const wordPressExternals = require( "./externals/wordpress" );

/**
 * The main Webpack configuration for building the main analysis file.
 *
 * @type {Object}
 */
module.exports = {
	entry: "./index.js",
	devtool: false,
	externals: [ externals, wordPressExternals ],
	output: {
		path: path.resolve( "dist", "build" ),
		filename: "analysis.js",
		library: [ "yoast", "analysis" ],
		libraryTarget: "window",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
};
