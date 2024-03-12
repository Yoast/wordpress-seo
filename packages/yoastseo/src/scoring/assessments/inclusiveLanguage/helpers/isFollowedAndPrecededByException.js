import { isFollowedByException } from "./isFollowedByException";
import { isPrecededByException } from "./isPrecededByException";


/**
 * Returns a callback that checks whether a non-inclusive phrase is both preceded and followed by specific exceptions.
 * For example, if a non-inclusive phrase is "crazy", a preceding exception is "to be", and a following exception is "about":
 * - returns true for "to be crazy about".
 * - returns false for "to be crazy in love"
 * - returns false for "there's something crazy about this".
 *
 * @param {string[]} words A list of words that is being queried.
 * @param {string[]} nonInclusivePhrase A list of words that are the non-inclusive phrase.
 * @param {string[]} precedingExceptions A list of exceptions to check .
 * @param {string[]} followingExceptions A list of words that are the non-inclusive phrase.
 *
 * @returns {function} A callback that checks whether a non-inclusive term is both preceded and followed by an exception.
 */
export function isFollowedAndPrecededByException( words, nonInclusivePhrase, precedingExceptions, followingExceptions ) {
	return ( index ) => {
		return ( isFollowedByException( words, nonInclusivePhrase, followingExceptions )( index ) &&
			isPrecededByException( words, precedingExceptions )( index ) );
	};
}

/**
 * Returns a callback that checks whether a non-inclusive phrase is NOT preceded and followed by specific exceptions.
 * For example, if a non-inclusive phrase is "crazy", a preceding exception is "to be", and a following exception is "about":
 * - returns false for "to be crazy about".
 * - returns true for "to be crazy in love"
 * - returns true for "there's something crazy about this".
 *
 * @param {string[]} words A list of words that is being queried.
 * @param {string[]} nonInclusivePhrase A list of words that are the non-inclusive phrase.
 * @param {string[]} precedingExceptions A list of words that are the non-inclusive phrase.
 * @param {string[]} followingExceptions A list of words that are the non-inclusive phrase.
 *
 * @returns {function} A callback that checks whether a non-inclusive term is both preceded and followed by an exception.
 */
export function isNotFollowedAndPrecededByException( words, nonInclusivePhrase, precedingExceptions, followingExceptions ) {
	return ( index ) => {
		return ! isFollowedAndPrecededByException( words, nonInclusivePhrase, precedingExceptions, followingExceptions )( index );
	};
}
