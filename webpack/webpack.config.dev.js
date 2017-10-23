/* global require, module */
const defaults = require( "./webpack.config.default" ).defaults;

const devConfig ={
	devtool: "eval",
};

module.exports = defaults( devConfig );
