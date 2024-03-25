import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

import participles from "../../config/internal/participles.js";
import { forEach, includes } from "lodash";

/**
 * Creates an array of participles found in a clause.
 *
 * @param {string} clauseText   The clause to finds participles in.
 *
 * @returns {Array} The array with the participles.
 */
export default function( clauseText ) {
	const words = getWords( clauseText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		if ( includes( participles, word ) ) {
			foundParticiples.push( word );
		}
	} );
	return foundParticiples;
}
