/** @module analyses/getKeywordDensity */

import countWords from "../stringProcessing/countWords.js";

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
 * @param {object} researcher The researcher.
 * @returns {number} The keyword density.
 */
export default function( paper, researcher ) {
	const wordCount = countWords( paper.getText() );
	if ( wordCount === 0 ) {
		return 0;
	}

	const keywordCount = researcher.getResearch( "keywordCount" );
	return ( keywordCount / wordCount ) * 100;
}
