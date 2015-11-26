var keywordRegexFunction = require( "../stringProcessing/keywordRegex.js" );
var replaceStringFunction = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" );

/**
 *
 * @param {Array} matches
 * @param keyword
 * @returns {Array|{index: number, input: string}|*}
 */
module.exports = function( matches, keyword ){
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
