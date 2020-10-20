import getAllWordsFromPaper from "../../../helpers/morphology/getAllWordsFromPaper";
import parseSynonyms from "../../../helpers/sanitize/parseSynonyms";
import getFunctionWords from "../config/";
import getWordForms from "../../../researches/base/getWordForms";
const functionWords = getFunctionWords();

/**
 * Gets all matching word forms for the keyphrase and synonyms.
 *
 * @param {Paper}       paper       The paper.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text or created forms.
 */
export default function( paper ) {
	// Collect and process/sanitize all data necessary to create word forms.
	const allWordsFromPaper = getAllWordsFromPaper( paper ).map( word => word.toLocaleLowerCase( "ca" ) );
	const keyphrase = paper.getKeyword().toLocaleLowerCase( "ca" ).trim();
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase( "ca" ).trim() );

	return getWordForms( keyphrase, synonyms, null, null, null, allWordsFromPaper, functionWords );
}
