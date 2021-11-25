const path = require( "path" );

/**
 * The main Webpack configuration for building the main analysis file.
 *
 * @type {Object}
 */
module.exports = {
	entry: "./src/worker/bootstrapAnalysis.js",
	devtool: false,
	output: {
		path: path.resolve( "dist", "build" ),
		filename: "bootstrap-analysis.js",
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
