/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );

module.exports = {
	buildDev: webpackConfig( { environment: "development" } ),
	buildProd: webpackConfig(),
	recalibration: webpackConfig( { recalibration: "enabled" } ),
};
