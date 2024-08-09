import getAllWordsFromTree from "../helpers/word/getAllWordsFromTree";

/**
 * Calculates the keyphrase density.
 *
 * @param {Paper} paper The paper containing keyphrase and text.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {number} The keyphrase density.
 */
export default function getKeyphraseDensity( paper, researcher ) {
	const getWordsCustomHelper = researcher.getHelper( "getWordsCustomHelper" );
	let wordCount = 0;

	// If there is a custom getWords helper, use its output for countWords.
	if ( getWordsCustomHelper ) {
		wordCount = getWordsCustomHelper( paper.getText() ).length;
	} else {
		wordCount = getAllWordsFromTree( paper ).length;
	}

	if ( wordCount === 0 ) {
		return 0;
	}

	const keyphraseCount = researcher.getResearch( "getKeyphraseCount" );

	return ( keyphraseCount.count / wordCount ) * 100;
}

/**
 * Calculates the keyphrase density.
 *
 * @deprecated Use getKeyphraseDensity instead.
 *
 * @param {Paper} paper The paper containing keyphrase and text.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {number} The keyphrase density.
 */
export function getKeywordDensity( paper, researcher ) {
	console.warn( "This function is deprecated, use getKeyphraseDensity instead." );
	return getKeyphraseDensity( paper, researcher );
}
