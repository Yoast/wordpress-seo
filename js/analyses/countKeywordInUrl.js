/** @module analyses/countKeywordInUrl */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {url} url The URL to check for keyword
 * @param {string} keyword The keyword to match
 * @returns {int} Number of times the keyword is found.
 */
module.exports = function( url, keyword ) {
	keyword = keyword.replace( /\s/ig, "-" );

	return wordMatch( url, keyword );
};
