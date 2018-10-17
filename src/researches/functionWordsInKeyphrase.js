import getWords from "../stringProcessing/getWords";
import getLanguage from "../helpers/getLanguage";
import getFunctionWordsFactory from "../helpers/getFunctionWords.js";
const getFunctionWords = getFunctionWordsFactory();
import { filter, get, includes, isEmpty } from "lodash-es";
/**
 * Checks if the keyphrase contains of function words only.
 *
 * @param {object} paper The paper containing the keyword.
 *
 * @returns {boolean} Whether the keyphrase contains of content words only.
 */
export default function( paper ) {
	const keyphrase = paper.getKeyword();

	// Return false if there are double quotes around the keyphrase.
	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		return false;
	}

	let keyphraseWords = getWords( keyphrase );
	const functionWords = get( getFunctionWords, [ getLanguage( paper.getLocale() ) ], [] );

	keyphraseWords = filter( keyphraseWords, function( word ) {
		return ( ! includes( functionWords.all, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( keyphraseWords );
}
