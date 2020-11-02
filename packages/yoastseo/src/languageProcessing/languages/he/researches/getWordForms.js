import getAllWordsFromPaper from "../../../helpers/morphology/getAllWordsFromPaper";
import parseSynonyms from "../../../helpers/sanitize/parseSynonyms";
import getFunctionWords from "../config/";
import getWordForms from "../../../researches/base/getWordForms";
import { createBasicWordForms } from "../morphology/createBasicWordForms";
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
	const allWordsFromPaper = getAllWordsFromPaper( paper ).map( word => word.toLocaleLowerCase( "he" ) );
	const keyphrase = paper.getKeyword().toLocaleLowerCase( "he" ).trim();
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase( "he" ).trim() );

	// In English we have function words and a function to create basic word forms.
	return getWordForms( keyphrase, synonyms, allWordsFromPaper, functionWords, null, null, createBasicWordForms );
}
