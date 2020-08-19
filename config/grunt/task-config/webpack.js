/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );
module.exports = () => {
	return {
		buildDev: () => webpackConfig( { environment: "development", pluginVersion: "<%= pluginVersionSlug %>" } ),
		buildProd: () => webpackConfig( { environment: "production", pluginVersion: "<%= pluginVersionSlug %>" } ),
	};
};
