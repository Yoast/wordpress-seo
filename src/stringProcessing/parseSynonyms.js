/** @module stringProcessing/parseSynonyms */

import stripSpaces from "../stringProcessing/stripSpaces.js";
import removePunctuationExceptQuotes from "../stringProcessing/removePunctuationExceptQuotes.js";

/**
 * Parses synonyms from a comma-separated string into an array.
 *
 * @param {String} synonyms The text to match
 *
 * @returns {Array} An array with all synonyms.
 */
export default function( synonyms ) {
	let synonymsSplit = synonyms.split( "," );

	synonymsSplit = synonymsSplit.map( function( synonym ) {
		return removePunctuationExceptQuotes( stripSpaces( synonym ) );
	} ).filter( function( synonym ) {
		return synonym;
	} );
	return synonymsSplit;
}
