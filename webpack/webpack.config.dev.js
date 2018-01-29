/* global require, module */
const defaults = require( "./webpack.config.default" ).defaults;
const webpack = require( "webpack" );

const devConfig = {
	devtool: "eval",
	plugins: [
		new webpack.DefinePlugin( {
			"process.env": {
				NODE_ENV: JSON.stringify( "development" ),
			},
		} ),
	],
	devServer: {
		publicPath: "/",
	},
};

module.exports = defaults( devConfig );
