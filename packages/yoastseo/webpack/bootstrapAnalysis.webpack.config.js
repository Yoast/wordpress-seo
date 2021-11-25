const path = require( "path" );

/**
 * The Webpack configuration for building the file to bootstrap analysis within a web worker.
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
