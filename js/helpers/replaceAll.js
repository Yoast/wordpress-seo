var escapeRegExp = require( "lodash/string/escapeRegExp" );

/**
 * Replace placeholders in the passed string.
 * @param {string} string The string that needs placeholders to be replaced.
 * @param {object} replacements The replacement values to be used.
 * @returns {string} The string with the replaced placeholders.
 */
var replaceAll = function( string, replacements ) {
	var replacementString = escapeRegExp( Object.keys( replacements ).join( "|" ) ).replace( "\\|", "|" );

	return string.replace( new RegExp( replacementString, "gi" ), function( matched ) {
		return replacements[ matched.toLowerCase() ];
	} );
};

module.exports = replaceAll;
