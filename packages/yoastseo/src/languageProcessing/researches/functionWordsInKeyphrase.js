import { isFeatureEnabled } from "@yoast/feature-flag";
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

	// The custom helper for getWords is only available in Japanese researcher.
	const getWordsCustomHelper = researcher.getHelper( "getWordsCustomHelper" );
	const keyphrase = paper.getKeyword();

	// Return false if there are double quotes around the keyphrase.
	let doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	const japaneseQuotes = [ "「", "」", "『", "』" ];

	doubleQuotes = isFeatureEnabled( "JAPANESE_SUPPORT" ) ? doubleQuotes.concat( japaneseQuotes ) : doubleQuotes;

	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		return false;
	}

	let keyphraseWords = getWordsCustomHelper ? getWordsCustomHelper( keyphrase ) : getWords( keyphrase );

	keyphraseWords = filter( keyphraseWords, function( word ) {
		return ( ! includes( functionWords, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( keyphraseWords );
}
