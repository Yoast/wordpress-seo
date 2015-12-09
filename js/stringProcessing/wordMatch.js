var keywordRegexFunction = require( "../stringProcessing/keywordRegex.js" );
var cleanTextFunction = require( "../stringProcessing/cleanText.js" );

/**
 * Returns the number of matches in a given string
 *
 * @param {String} text The text to use for matching the wordToMatch.
 * @param {String} wordToMatch The word to match in the text
 * @returns {String} The text without characters.
 */
module.exports = function( text, wordToMatch ) {
	text = cleanTextFunction( text );
	var regex = keywordRegexFunction( wordToMatch );
	var matches = text.match( regex );
	if ( matches === null ) {
		return 0;
	} else {
		return matches.length;
	}
};
