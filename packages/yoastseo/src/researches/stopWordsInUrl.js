/** @module researches/stopWordsInUrl */

import stopWordsInText from "./stopWordsInText.js";

/**
 * Matches stopwords in the URL. Replaces - and _ with whitespace.
 * @param {Paper} paper The Paper object to get the url from.
 * @returns {Array} stopwords found in URL
 */
export default function( paper ) {
	return stopWordsInText( paper.getUrl().replace( /[-_]/g, " " ) );
}
