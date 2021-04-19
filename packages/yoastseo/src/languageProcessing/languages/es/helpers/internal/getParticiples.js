import { includes } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

import participles from "../../config/internal/passiveVoiceParticiples";

/**
 * Creates an array of the participles found in a clause.
 *
 * @param {string} clauseText The clause to find participles in.
 *
 * @returns {Array} The list with participles.
 */
export default function getParticiples( clauseText ) {
	const words = getWords( clauseText );

	return words.filter( word => includes( participles, word ) );
}
