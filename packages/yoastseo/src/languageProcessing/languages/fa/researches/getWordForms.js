import getAllWordsFromPaper from "../../../helpers/morphology/getAllWordsFromPaper";
import parseSynonyms from "../../../helpers/sanitize/parseSynonyms";
import getFunctionWords from "../config/";
import getWordForms from "../../../researches/base/getWordForms";
const functionWords = getFunctionWords();

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
	const allWordsFromPaper = getAllWordsFromPaper( paper ).map( word => word.toLocaleLowerCase( "fa" ) );
	const keyphrase = paper.getKeyword().toLocaleLowerCase( "fa" ).trim();
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase( "fa" ).trim() );

	// In Farsi we have function words.
	return getWordForms( keyphrase, synonyms, allWordsFromPaper, functionWords, null, null, null );
}
