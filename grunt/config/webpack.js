/* global require */
const webpackConfig       = require( "../../webpack/webpack.config" );
const backportsOnlyConfig = require( "../../webpack/backports.webpack.config" );
const noExternalsConfig   = require( "../../webpack/no-externals.webpack.config" );

module.exports = {
	buildNoExternals: noExternalsConfig( { environment: "production" } ),
	buildBackportsOnly: backportsOnlyConfig( { environment: "production" } ),
	buildDev: webpackConfig( { environment: "development" } ),
	buildProd: webpackConfig(),
	recalibration: webpackConfig( { recalibration: "enabled" } ),
};
