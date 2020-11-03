/** @module analyses/getKeywordDensity */

import countWords from "../../helpers/word/countWords.js";

/**
 * Calculates the keyword density.
 *
 * @param {Object} paper        The paper containing keyword and text.
 * @param {Object} researcher   The researcher.
 * @param {boolean} hasStemmer  Whether the language has the stemmer or not.
 *
 * @returns {Object} The keyword density and whether there is a stemmer available or not.
 */
export default function( paper, researcher, hasStemmer ) {
	const wordCount = countWords( paper.getText() );
	if ( wordCount === 0 ) {
		return 0;
	}

	const keywordCount = researcher.getResearch( "keywordCount" );
	return {
		keywordDensity: ( keywordCount.count / wordCount ) * 100,
		stemmer: hasStemmer,
	};
}
