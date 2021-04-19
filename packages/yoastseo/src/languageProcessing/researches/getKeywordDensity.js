/** @module analyses/getKeywordDensity */

import countWords from "../helpers/word/countWords.js";

/**
 * Calculates the keyword density.
 *
 * @param {Object} paper        The paper containing keyword and text.
 * @param {Object} researcher   The researcher.
 *
 * @returns {Object} The keyword density and the stemmer.
 */
export default function( paper, researcher ) {
	const wordCount = countWords( paper.getText() );
	if ( wordCount === 0 ) {
		return 0;
	}

	const keywordCount = researcher.getResearch( "keywordCount" );
	const stemmer = researcher.getHelper( "getStemmer" );
	return {
		keywordDensity: ( keywordCount.count / wordCount ) * 100,
		stemmer: stemmer,
	};
}
