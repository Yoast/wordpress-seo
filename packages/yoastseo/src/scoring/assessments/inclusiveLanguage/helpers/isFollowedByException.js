import { includesWordsAtPosition } from "./includesWordsAtPosition";

/**
 * Checks whether the given list of words contains another list of words in the given order,
 * but not when they are followed by one of the exceptions.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} consecutiveWords The list of words to find.
 * @param {string[]} exceptions The list of exception phrases.
 *
 * @returns {function} A function that checks whether the given list of words is contained in another list of words in the given order.
 */
export function isFollowedByException( words, consecutiveWords, exceptions ) {
	const splitExceptions = exceptions.map( exception => exception.split( " " ) );
	return index => splitExceptions.some( exception => {
		const startIndex = index + consecutiveWords.length;
		if ( startIndex >= 0 ) {
			return includesWordsAtPosition( exception, startIndex, words );
		}
		return false;
	} );
}

/**
 * Checks whether the given list of words contains another list of words in the given order,
 * but only when they are followed by one of the exceptions.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} consecutiveWords The list of words to find.
 * @param {string[]} exceptions The list of exception phrases.
 *
 * @returns {function} A function that checks whether the given list of words is contained in another list of words in the given order.
 */
export function isNotFollowedByException( words, consecutiveWords, exceptions ) {
	return index => ! isFollowedByException( words, consecutiveWords, exceptions )( index );
}

