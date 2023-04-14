import countWords from "../helpers/word/countWords.js";

/**
 * Calculates the keyphrase density.
 *
 * @param {Object} paper        The paper containing keyphrase and text.
 * @param {Object} researcher   The researcher.
 *
 * @returns {Object} The keyphrase density.
 */
export default function getKeyphraseDensity( paper, researcher ) {
	const getWordsCustomHelper = researcher.getHelper( "getWordsCustomHelper" );
	let wordCount = countWords( paper.getText() );

	// If there is a custom getWords helper use its output for countWords.
	if ( getWordsCustomHelper ) {
		wordCount =  getWordsCustomHelper( paper.getText() ).length;
	}

	if ( wordCount === 0 ) {
		return 0;
	}

	const keyphraseCount = researcher.getResearch( "keyphraseCount" );

	return ( keyphraseCount.count / wordCount ) * 100;
}

/**
 * Calculates the keyphrase density.
 *
 * @deprecated Since version 20.8. Use getKeyphraseDensity instead.
 *
 * @param {Object} paper        The paper containing keyphrase and text.
 * @param {Object} researcher   The researcher.
 *
 * @returns {Object} The keyphrase density.
 */
export function getKeywordDensity( paper, researcher ) {
	console.warn( "This function is deprecated, use getKeyphraseDensity instead." );
	return getKeywordDensity( paper, researcher );
}
