import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

import participleStems from "../../config/internal/passiveVoiceParticiples";

/**
 * Checks if a Portuguese word is a participle.
 * @param {string} word A Portuguese word.
 * @returns {boolean} Returns true if word is a Portuguese participle, and false otherwise.
 */
function isParticiple( word ) {
	const participleSuffixes = [ "a", "o", "as", "os" ];
	// For each participle suffixes, check if the word ends in one of them.
	return participleSuffixes.some( suffix => {
		// Make sure only possible participles are targeted (minimum length being "> 3")
		if ( word.length > 3 && word.endsWith( suffix ) ) {
			// If the word ends with one of the suffixes, retrieve the stem.
			const stem = word.slice( 0, -( suffix.length ) );
			// Check if the stem is in the list of participle stems: return true if it is, otherwise return false.
			return participleStems.includes( stem );
		}
	} );
}

/**
 * Creates an array of participles for the participles found in a clause.
 *
 * @param {string} clauseText The clause to find participles in.
 *
 * @returns {Array} The list with participles.
 */
export default function getParticiples( clauseText ) {
	const words = getWords( clauseText );
	return words.filter( word => isParticiple( word ) );
}
