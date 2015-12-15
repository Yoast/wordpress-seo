var keywordRegexFunction = require( "../stringProcessing/stringToRegex.js" );
var replaceStringFunction = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" );

/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String} keyword The keyword to match
 * @returns integer foundInHeader The number of occurrences of the keyword in the header.
 */
module.exports = function( matches, keyword ) {
		var foundInHeader;
		if ( matches === null ) {
			foundInHeader = -1;
		} else {
			foundInHeader = 0;
			for ( var i = 0; i < matches.length; i++ ) {
				var formattedHeaders = replaceStringFunction(
					matches[ i ], removalWords
				);
				if (
					formattedHeaders.match( keywordRegexFunction( keyword ) ) ||
					matches[ i ].match( keywordRegexFunction( keyword ) )
				) {
					foundInHeader++;
				}
			}
		}
		return foundInHeader;
};
