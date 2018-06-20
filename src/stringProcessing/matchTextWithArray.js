/** @module stringProcessing/matchTextWithArray */

var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Matches strings from an array against a given text.
 *
 * @param {String} text The text to match
 * @param {Array} array The array with strings to match
 * @returns {Array} array An array with all matches of the text.
 */
module.exports = function( text, array ) {
	var matches = text.match( arrayToRegex( array ) );
	if ( matches === null ) {
		matches = [];
	}

	matches = matches.map( function( string ) {
		return stripSpaces( string );
	} );

	return matches;
};
