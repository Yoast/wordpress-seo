import { getWords } from "../../../../languageProcessing";
import { includesWordsAtPosition } from "./includesWordsAtPosition";

/**
 * Checks whether a list of words contains a sequence of words in the given order, excluding cases when
 * they are followed by one of the exceptions.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} consecutiveWords The sequence of words in the given order to find in the list.
 * @param {string[]} exceptions The list of exception phrases.
 *
 * @returns {function} A function that checks whether the given list of words is contained in another list of words in the given order.
 */
export function isFollowedByException( words, consecutiveWords, exceptions ) {
	const splitExceptions = exceptions.map( exception => getWords( exception, "\\s", false ) );
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

