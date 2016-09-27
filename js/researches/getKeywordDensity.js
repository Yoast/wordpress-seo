/** @module analyses/getKeywordDensity */

var countWords = require( "../stringProcessing/countWords.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );
var normalizeQuotes = require ( "../stringProcessing/quotes.js" ).normalize;

var escapeRegExp = require( "lodash/escapeRegExp" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
  * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var keyword = escapeRegExp( normalizeQuotes( paper.getKeyword() ) );
	var text = normalizeQuotes( paper.getText() );
	var locale = paper.getLocale();
	var wordCount = countWords( text );
	if ( wordCount === 0 ) {
		return 0;
	}
	var keywordCount = matchWords( text, keyword, locale );
	return ( keywordCount / wordCount ) * 100;
};
