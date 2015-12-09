var wordCountFunction = require( "../stringProcessing/wordCount.js" );
var wordMatchFunction = require( "../stringProcessing/wordMatch.js" );
var cleanTextFunction = require( "../stringProcessing/cleanText.js" );
/**
 * Calculates the keyword density .
 *
 * @param {String} text The text to count the keywords in.
 * @param {String} keyword The keyword to match.
 * @returns {int} The keyword density.
 */
module.exports = function( text, keyword ) {
	text = cleanTextFunction( text );
	var wordCount = wordCountFunction( text );
	var keywordCount = wordMatchFunction ( text, keyword );
	var keywordDensity = ( keywordCount / wordCount - ( keywordCount - 1 * keywordCount ) ) * 100;
	return keywordDensity.toFixed( 1 );
};
