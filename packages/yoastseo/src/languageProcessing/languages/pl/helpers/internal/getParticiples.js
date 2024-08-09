import { includes } from "lodash";
import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

import participles from "../../config/internal/participles";

/**
 * Creates an array of participles for the participles found in a clause.
 *
 * @param {string} clauseText The sentence part to find participles in.
 *
 * @returns {Array} The list with participles.
 */
export default function getParticiples( clauseText ) {
	const words = getWords( clauseText );

	return words.filter( word => includes( participles, word ) );
}
