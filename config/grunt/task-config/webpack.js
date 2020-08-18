/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );
module.exports = ( grunt ) => {
	return {
		buildDev: () => webpackConfig( { environment: "development", pluginVersion: "<%= pluginVersionSlug %>" } ),
		buildProd: () => webpackConfig( { environment: "production", pluginVersion: "<%= pluginVersionSlug %>" } ),
	};
};
