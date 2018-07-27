/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );

module.exports = {
	buildDev: webpackConfig( { development: true } ),
	buildProd: webpackConfig(),
};
