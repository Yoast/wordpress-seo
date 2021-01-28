import getWords from "../../../helpers/word/getWords";
import passiveEndings from "../config/internal/passiveEndings";
import { nonPassivesFullForms, nonPassiveStems } from "../config/internal/nonPassiveExceptions";

/**
 * Filters out words that are passive exceptions from an array.
 *
 * @param {string[]} matchedPassives     The words from the sentence that could be passives
 *
 * @returns {string[]}  The array of words with the non-passives filtered out
*/
const checkTurkishNonPassivesStemsList = function( matchedPassives ) {
	return matchedPassives.filter( passive => nonPassiveStems.some( stem => passiveEndings.some( function( ending ) {
		const pattern =  new RegExp( "^" + stem + ending + "$" );
		return ! pattern.test( passive );
	} ) ) );
};

/**
 * Checks the passed sentence to see if it contains Turkish passive verb forms and is not found in the non-passive full forms exception list.
 *
 * @param {string} sentence   The sentence to match against.
 *
 * @returns {Boolean}   Whether the sentence contains a Turkish verb passive voice.
 */
export default function determineSentenceIsPassiveTurkish( sentence ) {
	const words = getWords( sentence );

	// We only check words that is longer than 5 letters
	let matchedPassives = words.filter( word => ( word.length > 5 ) );

	// Filter out words that are passive exceptions from an array
	matchedPassives = matchedPassives.filter( word => ! nonPassivesFullForms.includes( word ) );
	matchedPassives = checkTurkishNonPassivesStemsList( matchedPassives );

	return matchedPassives.some( word => passiveEndings.some( ending => word.endsWith( ending ) ) );
}

