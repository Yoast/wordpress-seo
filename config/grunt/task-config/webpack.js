/* global require */
const webpackConfig = require( "../../webpack/webpack.config" );

module.exports = ( grunt ) => {
	return {
		watch: () => webpackConfig( { environment: "development", pluginVersion: grunt.config.process( "<%= pluginVersion %>" ), watch: true } ),
		buildDev: () => webpackConfig( { environment: "development", pluginVersion: grunt.config.process( "<%= pluginVersion %>" ) } ),
		buildProd: () => webpackConfig( { environment: "production", pluginVersion: grunt.config.process( "<%= pluginVersion %>" ) } ),
	};
};
