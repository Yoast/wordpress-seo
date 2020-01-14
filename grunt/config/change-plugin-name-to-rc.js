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
			const formattedDateTime = `
				${ date.getFullYear() }-
				${ `0${ date.getMonth() + 1 }`.slice( -2 ) }-
				${ `0${ date.getDate() }`.slice( -2 ) } 
				${ `0${ date.getHours() }`.slice( -2 ) }:
				${ `0${ date.getMinutes() }`.slice( -2 ) }`;

			const searchTerm = "Plugin Name: ";
			// The plugin name is taken as what appears after words "Plugin Name" and until the end of the line.
			const pluginNameRegex = new RegExp( `${ searchTerm }(.*)` );
			// Determine the extension for the new plugin name - its version and the date the RC is created.
			const pluginName = `$& (beta) | ${ config.branchForRC } | ${ formattedDateTime }`;
			console.log( pluginName );
			const contents = grunt.file.read( config.pluginMainFile ).replace( pluginNameRegex, pluginName );
			console.log( contents );
			grunt.file.write( config.pluginMainFile, contents );
		}
	);
};
