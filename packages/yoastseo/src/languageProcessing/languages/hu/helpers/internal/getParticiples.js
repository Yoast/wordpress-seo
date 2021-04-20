import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

import participlesInReAndRa from "../../config/internal/participles.js";

/**
 * Creates an array of participles found in a clause.
 *
 * @param {string} clauseText   The clause to finds participles in.
 *
 * @returns {Array} The array with the participles.
 */
export default function( clauseText ) {
	const words = getWords( clauseText );

	const participleEndingsRegex = new RegExp( "(ve|va|ódni|ődni)$" );

	return words.filter( word => participleEndingsRegex.test( word ) || participlesInReAndRa.includes( word ) );
}
