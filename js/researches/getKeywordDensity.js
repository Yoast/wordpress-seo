/** @module analyses/getKeywordDensity */

var filter = require( "lodash/filter" );

var countWords = require( "../stringProcessing/countWords.js" );
var transliterate = require ( "../stringProcessing/transliterate.js" );

var getWords = require( "../stringProcessing/getWords.js" );

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
	var words = getWords( text );
	var keywordCount = filter( words, function( word ) {
		return ( word === keyword || transliterate( word, locale ) === keyword );
	} );

	return ( keywordCount.length / wordCount ) * 100;
};
