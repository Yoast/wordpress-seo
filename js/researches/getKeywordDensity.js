/** @module analyses/getKeywordDensity */

var countWords = require( "../stringProcessing/countWords.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
  * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword();
	var text = paper.getText();
	var wordCount = countWords( text );
	var keywordCount = matchWords ( text, keyword );
	var keywordDensity = ( keywordCount / wordCount ) * 100;
	return keywordDensity.toFixed( 1 );
};
