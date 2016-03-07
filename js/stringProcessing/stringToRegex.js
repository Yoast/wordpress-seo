/** @module stringProcessing/stringToRegex */

var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );
var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/**
 * Creates a regex from a string so it can be matched everywhere in the same way.
 *
 * @param {string} string The string to make a regex from.
 * @param {string} extraBoundary A string that is used as extra boundary for the regex.
 * @param {boolean} dontReplaceDiacritics If set to true, it doesn't replace diacritics.
 * @returns {string} regex The regex made from the keyword
 */
module.exports = function( string, extraBoundary, dontReplaceDiacritics ) {
	if ( !dontReplaceDiacritics ) {
		string = replaceDiacritics( string );
	}
	string = sanitizeString( string );
	string = addWordBoundary( string, extraBoundary );
	return new RegExp ( string, "ig" );
};
