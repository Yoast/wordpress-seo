import getAllWordsFromPaper from "../../../helpers/morphology/getAllWordsFromPaper";
import parseSynonyms from "../../../helpers/sanitize/parseSynonyms";
import getWordForms from "../../../researches/base/getWordForms";

/**
 * Gets all matching word forms for the keyphrase and synonyms.
 *
 * @param {Paper} paper The paper.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text or created forms.
 */
export default function( paper ) {
	// Collect and process/sanitize all data necessary to create word forms.
	const allWordsFromPaper = getAllWordsFromPaper( paper ).map( word => word.toLocaleLowerCase() );
	const keyphrase = paper.getKeyword().toLocaleLowerCase().trim();
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase().trim() );

	// For default language support we have no stemmer, basic stemmer, morphology data or function words.
	return getWordForms( keyphrase, synonyms, null, null, null, allWordsFromPaper, [] );
}
