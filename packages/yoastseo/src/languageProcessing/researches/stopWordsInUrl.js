/** @module researches/stopWordsInUrl */

import wordsInText from "../helpers/word/wordsInText";

/**
 * Matches stopwords in the URL. Replaces - and _ with whitespace.
 *
 * @param {Paper}      paper      The Paper object to get the url from.
 * @param {Researcher} researcher The researcher object.
 *
 * @returns {Array} stopwords found in URL
 *
 * @deprecated since 1.48
 */
export default function( paper, researcher ) {
	const stopWords = researcher.getConfig( "stopWords" );
	const url       = paper.getUrl().replace( /[-_]/g, " " );
	return wordsInText( url, stopWords );
}
