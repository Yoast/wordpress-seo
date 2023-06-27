/** @module analyses/getKeywordDensity */

import countWords from "../helpers/word/countWords.js";
import removeHtmlBlocks from "../helpers/html/htmlParser";

/**
 * Calculates the keyword density.
 *
 * @param {Object} paper        The paper containing keyword and text.
 * @param {Object} researcher   The researcher.
 *
 * @returns {Object} The keyword density.
 */
export default function( paper, researcher ) {
	const getWordsCustomHelper = researcher.getHelper( "getWordsCustomHelper" );
	let text = paper.getText();
	text = removeHtmlBlocks( text );
	let wordCount = countWords( text );

	// If there is a custom getWords helper use its output for countWords.
	if ( getWordsCustomHelper ) {
		wordCount =  getWordsCustomHelper( paper.getText() ).length;
	}

	if ( wordCount === 0 ) {
		return 0;
	}

	const keywordCount = researcher.getResearch( "keywordCount" );

	return ( keywordCount.count / wordCount ) * 100;
}
