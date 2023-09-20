/**
 * Checks whether consecutiveWords can be found at the given index in words.
 *
 * @param {string[]} consecutiveWords The needle.
 * @param {number} index The position at which to find the needle in the haystack.
 * @param {string[]} words The haystack.
 *
 * @returns {boolean} Whether consecutiveWords can be found at the given index in words.
 */
export function includesWordsAtPosition( consecutiveWords, index, words ) {
	return consecutiveWords.every( ( word, j ) => words[ index + j ] === word );
}
