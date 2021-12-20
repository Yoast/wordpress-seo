import { filter, includes, isEmpty } from "lodash-es";
import getWords from "../helpers/word/getWords";

/**
 * Checks if the keyphrase contains of function words only.
 *
 * @param {object} paper The paper containing the keyword.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {boolean} Whether the keyphrase contains of content words only.
 */
export default function( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );

	// A helper to get words from the keyphrase for languages that don't use the default way.
	const getWordsCustomHelper = researcher.getHelper( "getWordsCustomHelper" );
	const keyphrase = paper.getKeyword();

	// Return false if there are double quotes around the keyphrase.
	let doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"", "「", "」", "『", "』" ];

	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		return false;
	}

	let keyphraseWords = getWordsCustomHelper ? getWordsCustomHelper( keyphrase ) : getWords( keyphrase );

	keyphraseWords = filter( keyphraseWords, function( word ) {
		return ( ! includes( functionWords, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( keyphraseWords );
}
