var escapeRegExp = require( "lodash/string/escapeRegExp" );

/**
 * Replace placeholders in the passed string.
 * @param {string} string The string that needs placeholders to be replaced.
 * @param {object} mapObject The replacement values to be used.
 * @returns {string} The string with the replaced placeholders.
 */
var replaceAll = function( string, mapObject ) {
	var replacementString = escapeRegExp( Object.keys( mapObject ).join( "|" ) ).replace( "\\|", "|" );

	return string.replace( new RegExp( replacementString, "gi" ), function( matched ) {
		return mapObject[ matched.toLowerCase() ];
	} );
};

module.exports = replaceAll;
