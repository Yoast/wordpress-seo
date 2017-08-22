/* global require */
const webpackConfigProd = require( "../../webpack/webpack.config.prod" );
const webpackConfigDev = require( "../../webpack/webpack.config.dev" );

module.exports = {
	buildDev: webpackConfigDev,
	buildProd: webpackConfigProd,
};
