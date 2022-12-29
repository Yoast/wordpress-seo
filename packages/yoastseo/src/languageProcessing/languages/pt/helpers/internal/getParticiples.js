import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

import participleStems from "../../config/internal/passiveVoiceParticiples";

/**
 * Checks if a Portuguese word is a participle.
 * @param {string} word A Portuguese word.
 * @returns {boolean} Returns true if word is a Portuguese participle, and false otherwise.
 */
function isParticiple( word ) {
	// Check if the word ends with one of the vowel endings
	if ( word.endsWith( "a" ) || word.endsWith( "o" ) ) {
		// Remove the vowel ending from the word
		const stem = word.slice( 0, -1 );
		// Check if the stem is in the list of participle roots
		if ( participleStems.includes( stem ) ) {
			return true;
		}
		// Check if the word ends with one of the vowel endings
	} else if ( word.endsWith( "as" ) || word.endsWith( "os" ) ) {
		// Remove the vowel ending from the word
		const stem = word.slice( 0, -2 );
		if ( participleStems.includes( stem ) ) {
			return true;
		}
	}
	return false;
}

/**
 * Creates an array of participles for the participles found in a clause.
 *
 * @param {string} clauseText The sentence part to find participles in.
 *
 * @returns {Array} The list with participles.
 */
export default function getParticiples( clauseText ) {
	const words = getWords( clauseText );
	return words.filter( word => isParticiple( word ) );
}
