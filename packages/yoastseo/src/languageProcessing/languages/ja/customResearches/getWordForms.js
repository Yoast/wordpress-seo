import { includes } from "lodash-es";
import parseSynonyms from "../../../helpers/sanitize/parseSynonyms";
import getContentWords from "../helpers/getContentWords";
import { languageProcessing } from "yoastseo";
const { baseStemmer } = languageProcessing;

/**
 * Creates word forms for each word in the given keyphrase.
 *
 * @param {string}   keyphrase         The keyphrase to generate word forms for.
 * @param {function} createForms       The function to create word forms in Japanese when the morphologyData is available or baseStemmer otherwise.
 *
 * @returns {Array<string[]>} The word forms for each word in the keyphrase.
 */
function getKeyphraseForms( keyphrase, createForms ) {
	const keyphraseWords = getContentWords( keyphrase );

	// The keyphrase is in double quotes: use it as an exact match keyphrase.
	const doubleQuotes = [ "「", "」", "『", "』", "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		return [ [ keyphrase ] ];
	}

	return keyphraseWords.map( word => createForms === baseStemmer ? [ createForms( word ) ] : createForms( word ) );
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
	const createForms = researcher.getHelper( "getStemmer" )( researcher );
	const keyphrase = paper.getKeyword().toLocaleLowerCase( "ja" ).trim();
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase( "ja" ).trim() );
	const keyphraseForms = getKeyphraseForms( keyphrase, createForms );
	const synonymsForms = synonyms.map( synonym => getKeyphraseForms( synonym, createForms ) );

	return { keyphraseForms, synonymsForms };
}
