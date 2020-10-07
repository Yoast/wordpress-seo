import { filter, get, includes, isEmpty } from "lodash-es";
import getWords from "../../helpers/word/getWords";

/**
 * Checks if the keyphrase contains of function words only.
 *
 * @param {object} paper The paper containing the keyword.
 * @param {object} functionWords The functionWords object.
 *
 * @returns {boolean} Whether the keyphrase contains of content words only.
 */
export default function( paper, functionWords ) {
	const keyphrase = paper.getKeyword();

	// Return false if there are double quotes around the keyphrase.
	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		return false;
	}

	let keyphraseWords = getWords( keyphrase );

	keyphraseWords = filter( keyphraseWords, function( word ) {
		return ( ! includes( functionWords.all, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( keyphraseWords );
}
