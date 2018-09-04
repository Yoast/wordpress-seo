/** @module stringProcessing/parseSynonyms */

import stripSpaces from '../stringProcessing/stripSpaces.js';

import removePunctuation from '../stringProcessing/removePunctuation.js';

/**
 * Matches strings from an array against a given text.
 *
 * @param {String} synonyms The text to match
 *
 * @returns {Array} An array with all synonyms.
 */
export default function( synonyms ) {
	let synonymsSplit = synonyms.split( "," );

	synonymsSplit = synonymsSplit.map( function( synonym ) {
		return removePunctuation( stripSpaces( synonym ) );
	} ).filter( function( synonym ) {
		return synonym;
	} );
	return synonymsSplit;
};
