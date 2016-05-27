/** @module stringProcessing/matchTextWithWord */

var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" );
var matchStringWithTransliteration = require( "../stringProcessing/matchTextWithTransliteration.js" );

/**
 * Returns the number of matches in a given string
 *
 * @param {string} text The text to use for matching the wordToMatch.
 * @param {string} wordToMatch The word to match in the text
 * @param {string} [extraBoundary] An extra string that can be added to the wordboundary regex
 * @returns {number} The amount of matches found.
 */
module.exports = function( text, wordToMatch, extraBoundary ) {
	text = stripSomeTags( text );
	text = unifyWhitespace( text );
	var matches = matchStringWithTransliteration( text, wordToMatch, extraBoundary );
	return matches.length;
};
