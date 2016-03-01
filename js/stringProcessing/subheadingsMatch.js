var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var replaceString = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );

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

			// TODO: This replaceString call seemingly doesn't work, as no replacement value is being sent to the .replace method in replaceString
			var formattedHeaders = replaceString(
				matches[ i ], removalWords
			);
			if (
				replaceDiacritics( formattedHeaders ).match( stringToRegex( keyword ) ) ||
				replaceDiacritics( matches[ i ] ).match( stringToRegex( keyword ) )
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
};
