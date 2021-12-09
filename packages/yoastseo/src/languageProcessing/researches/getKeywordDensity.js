/** @module analyses/getKeywordDensity */

import countWords from "../helpers/word/countWords.js";
import getWords from "../languages/ja/helpers/getWords.js";

/**
 * Calculates the keyword density.
 *
 * @param {Object} paper        The paper containing keyword and text.
 * @param {Object} researcher   The researcher.
 *
 * @returns {Object} The keyword density.
 */
export default function( paper, researcher ) {
	let wordCount = countWords( paper.getText() );
	const locale = paper.getLocale();

	// If there is a Japanese locale use the output of getWords for countWords.
	if ( locale === "ja" ) {
		wordCount = countWords( getWords( paper.getText() ) );
	}

	if ( wordCount === 0 ) {
		return 0;
	}

	const keywordCount = researcher.getResearch( "keywordCount" );

	return ( keywordCount.count / wordCount ) * 100;
}
