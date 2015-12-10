var wordMatch = require( "../stringProcessing/wordMatch.js" );
/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {String} text The text to check for keyword
 * @param {String} keyword The keyword to match
 * @returns {Int} Number of times the keyword is found.
 */
module.exports = function( text, keyword ) {
	keyword = keyword.replace( /\s/ig, "-" );
	return wordMatch( text, keyword, "\\-" );
};
