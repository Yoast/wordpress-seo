var keywordRegexFunction = require( "../stringProcessing/keywordRegex.js" );
var stripSomeTags = require( "../stringProcessing/stripSomeTags.js" );
var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );

/**
 * Returns the number of matches in a given string
 *
 * @param {String} text The text to use for matching the wordToMatch.
 * @param {String} wordToMatch The word to match in the text
 * @returns {String} The text without characters.
 */
module.exports = function( text, wordToMatch, extraBoundary ) {
	text = stripSomeTags ( text );
	text = unifyWhitespace( text );
	text = replaceDiacritics( text );
	var regex = keywordRegexFunction( wordToMatch, extraBoundary );
	var matches = text.match( regex );
	if ( matches === null ) {
		return 0;
	} else {
		return matches.length;
	}
};
