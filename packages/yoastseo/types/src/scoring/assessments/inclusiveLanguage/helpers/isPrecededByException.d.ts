/**
 * Checks whether the given list of words contains another list of words in the given order,
 * but not when they are preceded by one of the exceptions.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} exceptions The list of exception phrases.
 *
 * @returns {function} A function that checks whether the given list of words is contained in another list of words in the given order.
 */
export function isPrecededByException(words: string[], exceptions: string[]): Function;
/**
 * The reverse of isPrecededByException
 * Checks whether the given list of words contains another list of words in the given order,
 * but only when they are preceded by one of the exceptions.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} exception The list of exception phrases.
 * @returns {function} A function that checks whether the given list of words is not contained in another list of words in the given order.
 */
export function isNotPrecededByException(words: string[], exception: string[]): Function;
