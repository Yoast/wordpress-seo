import { get } from "lodash-es";
import parseSynonyms from "../../../helpers/sanitize/parseSynonyms";
import getContentWords from "../helpers/getContentWords";
import createWordForms from "../helpers/internal/createWordForms";
import doubleQuotes from "../../../helpers/sanitize/doubleQuotes";

/**
 * Creates word forms for each word in the given keyphrase.
 *
 * @param {string}      keyphrase   The keyphrase to generate word forms for.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Array<string[]>} The word forms for each word in the keyphrase.
 */
function getKeyphraseForms( keyphrase, researcher ) {
	// The keyphrase is in double quotes: use it as an exact match keyphrase.
	if ( doubleQuotes.includes( keyphrase[ 0 ] ) && doubleQuotes.includes( keyphrase[ keyphrase.length - 1 ] ) ) {
		return [ [ keyphrase ] ];
	}

	const keyphraseWords = getContentWords( keyphrase );

	// If the keyphrase does not contain content words, return an empty list.
	if ( keyphraseWords.length === 0 ) {
		return [ [] ];
	}

	const morphologyData = get( researcher.getData( "morphology" ), "ja", false );
	return keyphraseWords.map( word => morphologyData ? createWordForms( word, morphologyData ) : [ word ] );
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
	let keyphrase = paper.getKeyword().toLocaleLowerCase( "ja" ).trim();
	// Remove spaces from the keyphrase.
	keyphrase = keyphrase.replace( /\s/g, "" );
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase( "ja" ).trim() );
	const keyphraseForms = getKeyphraseForms( keyphrase, researcher );
	const synonymsForms = synonyms.map( synonym => getKeyphraseForms( synonym, researcher ) );

	return { keyphraseForms, synonymsForms };
}
