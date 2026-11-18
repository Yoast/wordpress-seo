import { filter, includes } from "lodash";

/**
 * Filters certain words from an array of words.
 *
 * @param {Array} array The words to check.
 * @param {Array} words The words to filter.
 *
 * @returns {Array} The original array with the certain words filtered out.
 */
export default function filterWordsFromArray( array, words = [] ) {
	return filter( array, function( word ) {
		return ( ! includes( words, word.trim().toLocaleLowerCase() ) );
	} );
}
