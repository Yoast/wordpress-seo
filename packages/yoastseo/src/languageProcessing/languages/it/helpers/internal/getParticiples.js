import { forEach, includes } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

import participles from "../../config/internal/passiveVoiceParticiples";

/**
 * Creates a participle list for the participles found in a clause.
 *
 * @param {string} clauseText The clause to find participles in.
 *
 * @returns {Array} The list with participles.
 */
export default function getParticiples( clauseText ) {
	const words = getWords( clauseText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		if ( includes( participles, word ) ) {
			foundParticiples.push( word );
		}
	} );
	return foundParticiples;
}
