/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );

module.exports = ( grunt ) => {
	buildDev: () => webpackConfig( grunt, { environment: "development" } ),
	buildProd: () => webpackConfig( grunt ),
};
