import { includesWordsAtPosition } from "./includesWordsAtPosition";

/**
 * Checks whether a list of words contains a sequence of words in the given order.
 * For example, whether [ "the", "cat", "is", "sleeping" ] contains the words ["is", "sleeping"] in that order.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} consecutiveWords The sequence of words in the given order to find in the list.
 *
 * @returns {number[]} The indices where the sequence of words can be found in the list of words.
 */
export function includesConsecutiveWords( words, consecutiveWords ) {
	const foundIndices = [];
	words.forEach( ( _, i ) => {
		if ( includesWordsAtPosition( consecutiveWords, i, words ) ) {
			foundIndices.push( i );
		}
	} );
	return foundIndices;
}
