/** @module analyses/getKeywordDensity */

const countWords = require( "../stringProcessing/countWords.js" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
 * @param {object} researcher The researcher.
 * @returns {number} The keyword density.
 */
module.exports = function( paper, researcher ) {
	const wordCount = countWords( paper.getText() );
	if ( wordCount === 0 ) {
		return 0;
	}

	const keywordCount = researcher.getResearch( "keywordCount" );
	return ( keywordCount.count / wordCount ) * 100;
};
