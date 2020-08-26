/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );

module.exports = ( grunt ) => {
	return {
		buildDev: () => webpackConfig( { environment: "development", pluginVersion: grunt.config.process( "<%= pluginVersion %>" ) } ),
		buildProd: () => webpackConfig( { environment: "production", pluginVersion: grunt.config.process( "<%= pluginVersion %>" ) } ),
	};
};
