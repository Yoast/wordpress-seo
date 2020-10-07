import getFunctionWords from "../config/functionWords.js";
import functionWordsInKeyphrase from "../../../researches/base/functionWordsInKeyphrase";
const functionWords = getFunctionWords();

/**
 * Checks if the keyphrase contains of function words only.
 *
 * @param {object} paper The paper containing the keyword.
 *
 * @returns {boolean} Whether the keyphrase contains of content words only.
 */
export default function( paper ) {
	return functionWordsInKeyphrase( paper, functionWords );
}
