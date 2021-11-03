import { get, includes } from "lodash-es";
import parseSynonyms from "../../../helpers/sanitize/parseSynonyms";
import createWordForms from "../helpers/internal/createWordForms";
import getContentWords from "../helpers/getContentWords";

/**
 * Creates word forms for each word in the given keyphrase.
 *
 * @param {string}   keyphrase         The keyphrase to generate word forms for.
 * @param {Object}   morphologyData    The morphology data to use when generating keyphrase word forms.
 *
 * @returns {Array<string[]>} The word forms for each word in the keyphrase.
 */
function getKeyphraseForms( keyphrase, morphologyData ) {
	const keyphraseWords = getContentWords( keyphrase );

	// The keyphrase is in double quotes: use it as an exact match keyphrase.
	const doubleQuotes = [ "「", "」", "『", "』", "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		return [ [ keyphrase ] ];
	}

	return keyphraseWords.map( word => createWordForms( word, morphologyData ) );
}

/**
 * Gets all matching word forms for the keyphrase and synonyms.
 *
 * @param {Paper}       paper       The paper.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text or created forms.
 */
export default function( paper, researcher ) {
	const keyphrase = paper.getKeyword().toLocaleLowerCase( "ja" ).trim();
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase( "ja" ).trim() );

	const morphologyData = get( researcher.getData( "morphology" ), "ja", false );

	const keyphraseForms = getKeyphraseForms( keyphrase, morphologyData );
	const synonymsForms = synonyms.map( synonym => getKeyphraseForms( synonym, morphologyData ) );

	return { keyphraseForms, synonymsForms };
}
