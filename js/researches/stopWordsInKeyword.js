/** @module researches/stopWordsInKeyword */

var stopWordsInText = require( "./stopWordsInText.js" );

/**
 * Checks for the amount of stop words in the keyword.
 * @param {Paper} paper The Paper object to be checked against.
 * @returns {Array} All the stopwords that were found in the keyword.
 */
module.exports = function( paper ) {
	return stopWordsInText( paper.getKeyword() );
};
