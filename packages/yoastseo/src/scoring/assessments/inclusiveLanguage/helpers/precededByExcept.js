import { includesConsecutiveWords } from "./includesConsecutiveWords";
import { includesWordsAtPosition } from "./includesWordsAtPosition";

/**
 * Checks whether the given list of words contains another list of words in the given order,
 * but not when they are preceded by one of the exceptions.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} consecutiveWords The list of words to find.
 * @param {string[]} exceptions The list of exception phrases.
 *
 * @returns {number[]} The indices where the given list of words is contained in another list of words in the given order.
 */
export function precededByExcept( words, consecutiveWords, exceptions ) {
	const foundIndices = includesConsecutiveWords( words, consecutiveWords );
	const exceptionsSplit = exceptions.map( exception => exception.split( " " ) );
	return foundIndices.filter( index =>
		! exceptionsSplit.some( exception => {
			const startIndex = index - exception.length;
			if ( startIndex >= 0 ) {
				return includesWordsAtPosition( exception, startIndex, words );
			}
			return false;
		} ) );
}
