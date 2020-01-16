/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );

module.exports = ( grunt ) => {
	return {
		buildDev: () => webpackConfig( grunt, { environment: "development" } ),
		buildProd: () => webpackConfig( grunt ),
	};
};
