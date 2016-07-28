/** @module analyses/getKeywordDensity */

var countWords = require( "../stringProcessing/countWords.js" );
var countWordOccurrences = require( "../stringProcessing/countWordOccurrences.js" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
  * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword();
	var text = paper.getText();
	var locale = paper.getLocale();
	var wordCount = countWords( text );
	if ( wordCount === 0 ) {
		return 0;
	}
	var keywordCount = countWordOccurrences( text, keyword, locale );
	return ( keywordCount / wordCount ) * 100;
};
