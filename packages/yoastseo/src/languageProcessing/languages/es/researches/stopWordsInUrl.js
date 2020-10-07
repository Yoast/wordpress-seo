/** @module researches/stopWordsInUrl */

import wordsInText from "../../../helpers/word/wordsInText";
import getStopWords from "../config/stopwords";
const stopwords = getStopWords();

/**
 * Matches stopwords in the URL. Replaces - and _ with whitespace.
 *
 * @param {Paper} paper The Paper object to get the url from.
 *
 * @returns {Array} stopwords found in URL
 *
 * @deprecated since 1.48
 */
export default function( paper ) {
	const url = paper.getUrl().replace( /[-_]/g, " " )
	return wordsInText( url, stopwords );
}
