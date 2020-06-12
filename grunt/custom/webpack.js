/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );
const get = require( "lodash" ).get;

module.exports = ( grunt ) => {
	const pluginVersion = get( grunt, "config.data.pluginVersion", null );

	return {
		buildDev: () => webpackConfig( { environment: "development", pluginVersion } ),
		buildProd: () => webpackConfig( { environment: "production", pluginVersion } ),
	};
};
