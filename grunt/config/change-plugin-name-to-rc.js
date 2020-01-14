/**
 * Pads a number with a leading zero.
 * We slice off the last two digits, because if the number is 10 or higher, we don't need the padding.
 *
 * @param {number} number The number to pad.
 *
 * @returns {string} A string with a number, padded with zero if the number is 9 or lower.
 */
const zeroPadding = ( number ) => {
	return `0${ number }`.slice( -2 );
};

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
			const formattedDateTime = `${ zeroPadding( date.getDate() ) }-` +
				`${ zeroPadding( date.getMonth() + 1 ) }-` +
				`${ date.getFullYear() } ` +
				`${ zeroPadding( date.getHours() ) }:` +
				`${ zeroPadding( date.getMinutes() ) }`;

			const searchTerm = "Plugin Name: ";
			// The plugin name is taken as what appears after words "Plugin Name" and until the end of the line.
			const pluginNameRegex = new RegExp( `${ searchTerm }(.*)` );
			// Determine the extension for the new plugin name - its version and the date the RC is created.
			const pluginName = `$& (RC) | ${ config.branchForRC } | ${ formattedDateTime }`;

			const contents = grunt.file.read( config.pluginMainFile ).replace( pluginNameRegex, pluginName );
			grunt.file.write( config.pluginMainFile, contents );
		}
	);
};
