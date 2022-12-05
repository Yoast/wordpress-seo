import { includesWordsAtPosition } from "./includesWordsAtPosition";

/**
 * Checks whether the given list of words contains another list of words in the given order.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} consecutiveWords The list of words to find.
 *
 * @returns {number[]} The indices where the given list of words is contained in another list of words in the given order.
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
