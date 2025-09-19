import getAllWordsFromTree from "../helpers/word/getAllWordsFromTree";

/**
 * @typedef {import("../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * Calculates the keyphrase density.
 *
 * @param {Paper} paper The paper containing keyphrase and text.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {{density: number, textLength: number}} The keyphrase density and text length.
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
		return {
			density: 0,
			textLength: wordCount,
		};
	}

	const keyphraseCount = researcher.getResearch( "getKeyphraseCount" );

	return {
		density: ( keyphraseCount.count / wordCount ) * 100,
		textLength: wordCount,
	};
}

/**
 * Calculates the keyphrase density.
 *
 * @deprecated Use getKeyphraseDensity instead.
 *
 * @param {Paper} paper The paper containing keyphrase and text.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {{density: number, textLength: number}} The keyphrase density and text length.
 */
export function getKeywordDensity( paper, researcher ) {
	console.warn( "This function is deprecated, use getKeyphraseDensity instead." );
	return getKeyphraseDensity( paper, researcher );
}
