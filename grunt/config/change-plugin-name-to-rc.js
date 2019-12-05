/**
 * Modifies the plugin name to include version number and the current date and time.
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"change-plugin-name-to-rc",
		"Changes the name in the plugin comment with added information about the rc",
		function() {
			const config = grunt.config();

			const date = new Date();
			const formattedDateTime = `${ date.getFullYear() }-${ date.getMonth() }-${ date.getDay() } ${ date.getHours() }:${ date.getMinutes() }`;

			const searchTerm = "Plugin Name: ";
			// The plugin name is taken as what appears after words "Plugin Name" and until the end of the line.
			const pluginNameRegex = new RegExp( `${ searchTerm }(.*)` );
			// Determine the extension for the new plugin name - its version and the date the RC is created.
			const pluginName = `$& | ${ config.pluginVersion } | ${ formattedDateTime }`;

			const contents = grunt.file.read( config.pluginMainFile ).replace( pluginNameRegex, pluginName );
			grunt.file.write( config.pluginMainFile, contents );
		}
	);
};
