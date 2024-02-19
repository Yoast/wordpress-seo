import { getWords } from "../../../../languageProcessing";
import { includesWordsAtPosition } from "./includesWordsAtPosition";

/**
 * Checks whether the given list of words contains another list of words in the given order,
 * but not when they are preceded by one of the exceptions.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} exceptions The list of exception phrases.
 *
 * @returns {function} A function that checks whether the given list of words is contained in another list of words in the given order.
 */
export function isPrecededByException( words, exceptions ) {
	const splitExceptions = exceptions.map( exception => getWords( exception, "\\s", false ) );
	return index => splitExceptions.some( exception => {
		const startIndex = index - exception.length;
		if ( startIndex >= 0 ) {
			return includesWordsAtPosition( exception, startIndex, words );
		}
		return false;
	} );
}

/**
 * The reverse of isPrecededByException
 * Checks whether the given list of words contains another list of words in the given order,
 * but only when they are preceded by one of the exceptions.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} exception The list of exception phrases.
 * @returns {function} A function that checks whether the given list of words is not contained in another list of words in the given order.
 */
export function isNotPrecededByException( words, exception ) {
	return ( index ) => ! isPrecededByException( words, exception )( index );
}
