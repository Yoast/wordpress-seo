var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var replaceString = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" );

/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String} keyword The keyword to match
 * @returns {number} The number of occurrences of the keyword in the headings.
 */
module.exports = function( matches, keyword ) {
	var foundInHeader;
	if ( matches === null ) {
		foundInHeader = -1;
	} else {
		foundInHeader = 0;
		for ( var i = 0; i < matches.length; i++ ) {
			var formattedHeaders = replaceString(
				matches[ i ], removalWords
			);
			if (
				formattedHeaders.match( stringToRegex( keyword ) ) ||
				matches[ i ].match( stringToRegex( keyword ) )
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
};
