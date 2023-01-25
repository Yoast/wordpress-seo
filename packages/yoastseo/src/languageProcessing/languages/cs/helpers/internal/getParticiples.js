import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;
import getPassiveEndingsCzech from "../../config/internal/passiveVoiceEndings";

/**
 * Creates an array of participles found in a clause.
 *
 * @param {string} clauseText The clause to find participles in.
 *
 * @returns {Array} The list with participles found.
 */
export default function( clauseText ) {
	const words = getWords( clauseText );

	return words.filter( word => getPassiveEndingsCzech.some( ending => word.endsWith( ending ) ) );
}
