/** @module stringProcessing/parseSynonyms */

import stripSpaces from "./stripSpaces.js";
import removePunctuationExceptQuotes from "./removePunctuationExceptQuotes.js";

/**
 * Parses synonyms from a comma-separated string into an array.
 *
 * @param {String} synonyms The text to match
 *
 * @returns {Array} An array with all synonyms.
 */
export default function( synonyms ) {
	let synonymsSplit = synonyms.split( "," );

	synonymsSplit = synonymsSplit.map( synonym =>
		removePunctuationExceptQuotes( stripSpaces( synonym ) ) ).filter( synonym => synonym );

	return synonymsSplit;
}
