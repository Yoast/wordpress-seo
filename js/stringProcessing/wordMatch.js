var keywordRegexFunction = require( "../stringProcessing/keywordRegex.js" );
/**
 * Returns the number of matches in a given string
 *
 * @param {String} text The text to use for matching the wordToMatch.
 * @param {String} wordToMatch The word to match in the text
 * @returns {String} The text without characters.
 */
module.exports = function( text, wordToMatch ) {
	var regex = keywordRegexFunction( wordToMatch );
	var matches = text.match( regex );
	var count;
	if ( matches === null ) {
		count = 0;
	} else {
		count = matches.length;
	}
	return count;
};
