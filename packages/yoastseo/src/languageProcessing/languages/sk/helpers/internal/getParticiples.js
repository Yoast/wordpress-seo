import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

/**
 * Creates an array of participles found in a clause.
 *
 * @param {string} clauseText The clause to find participles in.
 *
 * @returns {Array} The list with participles found.
 */
export default function( clauseText ) {
	const words = getWords( clauseText );
	const participleEndingsRegex = new RegExp( "(ný|ní|tý|ná|tá|né|té)$" );

	return words.filter( word => participleEndingsRegex.test( word ) );
}
