/**
 * Checks whether a sequence of words in a particular order can be found at the given index in the word list.
 *
 * @param {string[]} consecutiveWords The sequence of words in a particular order.
 * @param {number} index The position at which to find the consecutive word.
 * @param {string[]} words The text.
 *
 * @returns {boolean} Whether consecutiveWords can be found at the given index in words.
 */
export function includesWordsAtPosition( consecutiveWords, index, words ) {
	return consecutiveWords.every( ( word, j ) => words[ index + j ] === word );
}
