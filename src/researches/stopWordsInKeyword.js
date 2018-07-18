/** @module researches/stopWordsInKeyword */

var stopWordsInText = require( "./stopWordsInText.js" );

var escapeRegExp = require( "lodash/escapeRegExp" );

/**
 * Checks for the amount of stop words in the keyword.
 * @param {Paper} paper The Paper object to be checked against.
 * @returns {Array} All the stopwords that were found in the keyword.
 */
module.exports = function( paper ) {
	var keyword = escapeRegExp( paper.getKeyword() );
	return stopWordsInText( keyword );
};
