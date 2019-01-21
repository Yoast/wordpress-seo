/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );

module.exports = {
	buildDev: () => webpackConfig( { environment: "development" } ),
	buildProd: () => webpackConfig(),
	recalibrationDev: () => webpackConfig( { environment: "development", recalibration: "enabled" } ),
	recalibration: () => webpackConfig( { recalibration: "enabled" } ),
};
